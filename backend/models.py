from sqlalchemy import Boolean, Column, ForeignKey, Integer, Float, String
from sqlalchemy.orm import relationship

from database import Base


class Food(Base):
    __tablename__ = "food"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    recos = relationship("Recommendation", back_populates="food", foreign_keys="Recommendation.food_id")


class RecoType(Base):
    __tablename__ = "reco_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)

    items = relationship("Recommendation", backref="type")


class Recommendation(Base):
    __tablename__ = "recommendation"

    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("food.id"))
    type_id = Column(Integer, ForeignKey("reco_type.id"))
    impact_once = Column(Float)
    freq_weekly = Column(Integer)
    text_short = Column(String, unique=True, index=True)
    text_long = Column(String, unique=True, index=True)
    replacement_food_id = Column(Integer, ForeignKey("food.id"))

    food = relationship("Food", back_populates="recos", foreign_keys=[food_id])
    replacement = relationship("Food", foreign_keys=[replacement_food_id])
