from typing import List
from pydantic import BaseModel


class RecoBase(BaseModel):
    food_id: int
    type_id: int
    impact_once: float
    freq_weekly: int
    text_short: str
    text_long: str


class RecoCreate(RecoBase):
    pass


class Recommendation(RecoBase):
    id: int

    class Config:
        orm_mode = True


class FoodBase(BaseModel):
    name: str


class FoodCreate(FoodBase):
    pass


class Food(FoodBase):
    id: int
    recos: List[Recommendation] = []

    class Config:
        orm_mode = True