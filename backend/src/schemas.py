from typing import List, Optional, Any
from pydantic import BaseModel


class RecoBase(BaseModel):
    food_id: Optional[int]
    text_short: str
    text_long: str
    has_recipe: bool
    impact_once: Optional[float]
    replacement_food_id: Optional[int]
    replacement_food_name: Optional[str]
    calculate_impact: Optional[bool]


class RecoCreate(RecoBase):
    food_name: str
    pass


class Recommendation(RecoBase):
    # id will be generated by the db
    id: int

    # food_id. inherited from RecoBase, become required
    food_id: int

    # TODO: Need a better solution for type hint
    # TODO: Explore other classes (i.e. food and aliases)
    replacement: Any

    class Config:
        orm_mode = True


class RecoType(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class FoodBase(BaseModel):
    name: str
    standard_qty: Optional[float]
    standard_unit: Optional[str]


class FoodCreate(FoodBase):
    pass


class Food(FoodBase):
    id: int
    recos: List[Recommendation] = []

    class Config:
        orm_mode = True


class FoodNameWithAlias(BaseModel):
    name: str
    aliases: str

    class Config:
        orm_mode = True


class LandUse(BaseModel):
    id: int
    food_id: int
    mean: Optional[float]
    median: Optional[float]

    class Config:
        orm_mode = True


class WaterUse(BaseModel):
    id: int
    food_id: int
    mean: Optional[float]
    median: Optional[float]

    class Config:
        orm_mode = True
