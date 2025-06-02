from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.schemas import car as car_schema
from app.models.user import User
from app.auth.dependencies import get_current_user
from app.crud import car as car_crud

router = APIRouter(prefix="/cars", tags=["Cars"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create
@router.post("/", response_model=car_schema.CarOut)
def create_car(
    car: car_schema.CarCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return car_crud.create_car(db, car.dict())

# Read all
@router.get("/", response_model=List[car_schema.CarOut])
def read_cars(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return car_crud.get_cars(db)

# Read one
@router.get("/{car_id}", response_model=car_schema.CarOut)
def read_car(
    car_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    car = car_crud.get_car(db, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

# Update
@router.put("/{car_id}", response_model=car_schema.CarOut)
def update_car(
    car_id: int,
    updated_car: car_schema.CarCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    car = car_crud.update_car(db, car_id, updated_car.dict())
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

# Delete
@router.delete("/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_car(
    car_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    car = car_crud.delete_car(db, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return