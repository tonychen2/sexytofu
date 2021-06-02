from sqlalchemy import create_engine, MetaData
import json
import sys
import pandas as pd

SQLALCHEMY_DATABASE_URL = "sqlite:///./sexy-tofu.db"
GHGI_SOURCE_FILE_URL = "./src/ghgi/ghgi/datasets/master/products.json"
LAND_WATER_SOURCE_FILE_URL = "./land_water_data.csv"

NAME_MAPPER = {"other pulses": "pulses",
               "pig meat": "pork",
               "poultry meat": "poultry",
               "onions & leeks": "onions & leeks (alliums)",
               "groundnuts": "peanuts",
               "bovine meat (beef herd)": "beef (beef herd)",
               "bovine meat (dairy herd)": "beef (dairy herd)"}

# Check for Python version dependency
if sys.version_info < (3, 6, 0):
    raise Exception("Python version > 3.6 required")

# Load source data
with open(GHGI_SOURCE_FILE_URL) as f:
    ghgi_data = json.load(f)

land_water_data = pd.read_csv(LAND_WATER_SOURCE_FILE_URL,
                              dtype={'Name': str, 'Mean': float, 'Median': float})

food_lookup = {name: i+1 for i, value in enumerate(ghgi_data.values()) for name in value["names"]}

# Load database
engine = create_engine(SQLALCHEMY_DATABASE_URL)
conn = engine.connect()

metadata = MetaData()
metadata.reflect(bind=engine)

# Re-create food table and parent child table
food_table = metadata.tables["food"]
parent_child_table = metadata.tables["food_parent_child"]
conn.execute(food_table.delete())
conn.execute(parent_child_table.delete())
for food, details in ghgi_data.items():
    standard_qty = details.get("g")

    # TODO: refine this logic to include super
    if not standard_qty:
        standard_unit = None
    elif standard_qty >= 400:
        standard_qty = round(standard_qty / 454, 1)
        standard_unit = "pound"
    elif standard_qty >= 100:
        standard_qty = round(standard_qty / 28)
        standard_unit = "ounce"
    else:
        standard_unit = "gram"

    conn.execute(food_table.insert().values(name=food, standard_qty=standard_qty, standard_unit=standard_unit))

    food_id = food_lookup[food]
    parent_sum = sum(details["super"].values())
    for k, v in details["super"].items():
        parent_id = food_lookup[k]
        conn.execute(parent_child_table.insert().values(child_id=food_id,
                                                        parent_id=parent_id,
                                                        perc=v/parent_sum))

# Re-create alias table
alias_table = metadata.tables["food_alias"]
conn.execute(alias_table.delete())
for alias, food_id in food_lookup.items():
    conn.execute(alias_table.insert().values(alias=alias, food_id=food_id))

# Recreate land use, water use, and greenhouse gas emission tables
land_water_data["Food"] = land_water_data["Food"].str.lower()
land_water_data["Food"] = land_water_data["Food"].replace(NAME_MAPPER)

land_use_table = metadata.tables["land_use"]
water_use_table = metadata.tables["water_use"]
greenhouse_gas_emission_table = metadata.tables["greenhouse_gas_emission"]
conn.execute(land_use_table.delete())
conn.execute(water_use_table.delete())
conn.execute(greenhouse_gas_emission_table.delete())

added_food_id = set([])
n_food = len(ghgi_data)
for i, row in land_water_data.iterrows():
    alias = row["Food"]
    if alias not in food_lookup:
        food_id = n_food + 1
        n_food += 1
        added_food_id.add(food_id)
        food_lookup[alias] = food_id
        conn.execute(food_table.insert().values(name=alias))
        conn.execute(alias_table.insert().values(alias=alias, food_id=food_id))

    food_id = food_lookup[alias]
    if row["Data Type"] == "GHG":
        target_table = greenhouse_gas_emission_table
    elif row["Data Type"] == "Land Use":
        target_table = land_use_table
    elif row["Data Type"] == "Freshwater Withdrawals":
        target_table = water_use_table
    else:
        continue

    conn.execute(target_table.insert().values(food_id=food_id,
                                              mean=row["Mean"],
                                              median=row["Median"]))

# TODO: Add land use, water use, and greenhouse gas emission data for more food using their parents' data
# for i, food in enumerate(ghgi_data.keys()):
#     food_id = i + 1
#     if food_id not in added_food_id:
#         for table in [land_use_table, water_use_table, greenhouse_gas_emission_table]:
#             parents = conn.execute(table.select(table.parent_id, table.perc).where(table.child_id == food_id))
