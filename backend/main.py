from fastapi import FastAPI, Depends, HTTPException
from ghgi.ghgi import parser
from typing import Any, Optional
from pydantic import BaseModel
# from configparser import ConfigParser

from sqlalchemy.orm import Session
import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Type aliases
Name = str
Quantity = float
Unit = str
Product = dict[str, Any]

# # db connection
# config_parser = ConfigParser()
# config_parser.read("db.conf")
# config = {k: v for k, v in config_parser.items("mysql")}
# cnx = MySQLConnection(**config)


class SearchInput(BaseModel):
    groceryList: list


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def root():
    return {"message": "Say hi to Sexy Tofu!"}


@app.get("/parse/")
async def parse(query_text: str) -> Product:
    qtys = parser.amounts(query_text, False)['qtys']
    return qtys[0]


@app.get("/recommendation/{product_name}/", response_model=list[schemas.Recommendation])
async def recommendations(product_name: str,
                          skip: Optional[int] = 0,
                          limit: Optional[int] = 5,
                          db: Session = Depends(get_db)) -> list[str]:
    food = crud.get_food_by_name(db=db, name=product_name)
    if food is None:
        raise HTTPException(status_code=404, detail=f"{product_name} not found")
    recos = crud.get_recos_by_food(db=db, food_id=food.id, skip=skip, limit=limit)
    if recos is None:
        raise HTTPException(status_code=404, detail=f"No recommendation found for {product_name}")
    return recos


@app.post("/rate")
async def rate(products: SearchInput):
    pass