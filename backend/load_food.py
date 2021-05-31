from sqlalchemy import create_engine, MetaData
import json
import sys

SQLALCHEMY_DATABASE_URL = "sqlite:///./sexy-tofu.db"
SOURCE_FILE_URL = "./src/ghgi/ghgi/datasets/master/products.json"

# Check for Python version dependency
if sys.version_info < (3, 6, 0):
    raise Exception("Python version > 3.6 required")

# Load source data
with open(SOURCE_FILE_URL) as f:
    data = json.load(f)

food_lookup = {name: i+1 for i, value in enumerate(data.values()) for name in value["names"]}

# Load database
engine = create_engine(SQLALCHEMY_DATABASE_URL)
conn = engine.connect()

metadata = MetaData()
metadata.reflect(bind=engine)

# Insert data
food_table = metadata.tables["food"]
conn.execute(food_table.delete())
for food, details in data.items():
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

alias_table = metadata.tables["food_alias"]
conn.execute(alias_table.delete())
for alias, food_id in food_lookup.items():
    conn.execute(alias_table.insert().values(alias=alias, food_id=food_id))