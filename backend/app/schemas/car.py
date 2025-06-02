from pydantic import BaseModel

class CarCreate(BaseModel):
    brand: str
    model: str
    year: int
    color: str
    price: int
    mileage: int
    fuel_type: str
    transmission: str
    registration_number: str

class CarOut(CarCreate):
    id: int

    class Config:
        orm_mode = True
