## Overview
The backend, written in Python using the [FastAPI](https://fastapi.tiangolo.com/) framework, connects to a [SQLite](https://www.sqlite.org/) database with [SQLAlchemy](https://docs.sqlalchemy.org/).


## Getting started
Python 3.9 or later is required. It is highly recommended to create a virtual environments via [venv](https://docs.python.org/3/library/venv.html) in order to avoid package version conflicts with other projects. To install all dependencies, do the following in command line:
```
pip install -r requirements.txt
```

To run the server, `cd` into the `src` directory, and execute
```
uvicorn --reload main:app
```


## Greenhouse Gas Index Database (GHGI)
Sexy Tofu is built upon the open-source project [GHGI](https://github.com/ghgindex/ghgi). Its source code is included, but the backend only relies on a modified version of `./src/ghgi/ghgi/parser.py` for query parsing. A backlog task is to explore what the best way of integration might be.


## Data
Three different datasets feed into Sexy Tofu:
1. There is `land_water_data.csv`, provided by Poore and Nemecek's `Reducing food’s environmental impacts through producers and consumers`, for land use and water consumption. `load_food.py` ingests the data into the database, leveraging GHGI's work in naming standardization for each food ingredient (e.g. chicken thigh and chicken breast are both considered aliases for poultry)
2. CO2 emission data come from GHGI (introduced above), which combines data from the same aforementioned paper as well as other sources. For details, please refer to GHGI's [README](). For now, it is not supplied by this backend - the frontend directly calls GHGI's web API. This might change in the future.
3. Sustainability recommendations for individual food ingredient, categorized by four R's: replace, reduce, relocate, and recipe.

To manage the database (stored in sexy-tofu.db), please use any SQLite client of your choice.