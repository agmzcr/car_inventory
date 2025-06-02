from sqlalchemy.orm import Session
from app.models.car import Car

def create_car(db: Session, car_data: dict):
    db_car = Car(**car_data)
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

def get_cars(db: Session):
    return db.query(Car).all()

def get_car(db: Session, car_id: int):
    return db.query(Car).filter(Car.id == car_id).first()

def update_car(db: Session, car_id: int, updated_data: dict):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        return None
    for key, value in updated_data.items():
        setattr(car, key, value)
    db.commit()
    db.refresh(car)
    return car

def delete_car(db: Session, car_id: int):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        return None
    db.delete(car)
    db.commit()
    return car