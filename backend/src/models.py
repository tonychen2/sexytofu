from sqlalchemy import Boolean, Column, ForeignKey, Integer, Float, String
from sqlalchemy.orm import relationship

from .database import Base


class Food(Base):
    __tablename__ = "food"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    standard_qty = Column(Float)
    standard_unit = Column(String)

    recos = relationship("Recommendation", back_populates="food", foreign_keys="Recommendation.food_id")


class FoodAlias(Base):
    __tablename__ = "food_alias"

    id = Column(Integer, primary_key=True, index=True)
    alias = Column(String, unique=True, index=True)
    food_id = Column(Integer, ForeignKey('food.id'))

    food = relationship("Food")


class FoodParentChild(Base):
    __tablename__ = "food_parent_child"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("food.id"), index=True)
    parent_id = Column(Integer, ForeignKey("food.id"), index=True)
    perc = Column(Float)

    child = relationship("Food", foreign_keys=[child_id])
    parent = relationship("Food", foreign_keys=[parent_id])


class GreenhouseGasEmission(Base):
    __tablename__ = "greenhouse_gas_emission"

    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("food.id"), unique=True, index=True)
    mean = Column(Float)
    median = Column(Float)

    food = relationship("Food")


class LandUse(Base):
    __tablename__ = "land_use"

    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("food.id"), unique=True, index=True)
    mean = Column(Float)
    median = Column(Float)

    food = relationship("Food")


class WaterUse(Base):
    __tablename__ = "water_use"

    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("food.id"), unique=True, index=True)
    mean = Column(Float)
    median = Column(Float)

    food = relationship("Food")


class Recommendation(Base):
    __tablename__ = "recommendation"

    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("food.id"))
    text_short = Column(String, unique=True)
    text_long = Column(String, unique=True)
    has_recipe = Column(Boolean)
    impact_once = Column(Float)
    replacement_food_id = Column(Integer, ForeignKey("food.id"))
    replacement_food_name = Column(String)
    calculate_impact = Column(Boolean)

    food = relationship("Food", back_populates="recos", foreign_keys=[food_id])
    replacement = relationship("Food", foreign_keys=[replacement_food_id])
