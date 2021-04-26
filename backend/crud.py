from sqlalchemy.orm import Session

import models, schemas


def get_recos_by_food(db: Session, food_id: int, skip: int, limit: int):
    return db.query(models.Recommendation).filter(models.Food.id == food_id).offset(skip).limit(limit).all()


def get_food_by_name(db: Session, name: str):
    return db.query(models.Food).filter(models.Food.name == name).first()


