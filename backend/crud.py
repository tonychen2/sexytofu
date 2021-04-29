from sqlalchemy.orm import Session

from models import Food, Recommendation


def get_recos_by_food(db: Session, food_id: int, skip: int, limit: int):
    return db.query(Recommendation).filter(Recommendation.food_id == food_id).offset(skip).limit(limit).all()


def get_food_by_name(db: Session, name: str):
    return db.query(Food).filter(Food.name == name).first()


