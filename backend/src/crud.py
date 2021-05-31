from sqlalchemy.orm import Session
from sqlalchemy import select, delete

import schemas, models


def get_all_recos(db: Session):
    return db.query(models.Recommendation).all()


def get_recos_by_food(db: Session, food_id: int, skip: int, limit: int):
    return db.query(models.Recommendation).filter(models.Recommendation.food_id == food_id).offset(skip).limit(limit).all()


def get_food_by_alias(db: Session, alias: str):
    return db.query(models.Food).join(models.FoodAlias.food).filter(models.FoodAlias.alias == alias).first()


def get_all_reco_types(db: Session):
    return db.query(models.RecoType).all()


def get_all_food_aliases(db: Session):
    return db.execute(select(models.Food.id, models.Food.name, models.FoodAlias.alias).join(models.FoodAlias.food)).all()


def create_recommendation(db: Session, reco: schemas.RecoCreate):
    # Lookup food_id's and type_id based on input text
    data = reco.dict()
    data["food_id"] = get_food_by_alias(db, data["food_name"]).id
    data.pop("food_name")
    if data["replacement_food_name"] is not None:
        data["replacement_food_id"] = get_food_by_alias(db, data["replacement_food_name"]).id
    data.pop("replacement_food_name")

    db_reco = models.Recommendation(**data)
    db.add(db_reco)
    db.commit()
    db.refresh(db_reco)
    return db_reco


def delete_recommendation(db: Session, reco_id: int):
    db.execute(delete(models.Recommendation).where(models.Recommendation.id == reco_id))
    db.commit()
    return
