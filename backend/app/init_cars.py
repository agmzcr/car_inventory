from app.database import SessionLocal
from app.models.car import Car

def init_cars():
    db = SessionLocal()
    if db.query(Car).count() == 0:
        cars = [
            Car(brand="Toyota", model="Corolla", year=2020, color="Red", price=20000, mileage=15000, fuel_type="Petrol", transmission="Automatic", registration_number="0397JHB"),
            Car(brand="Honda", model="Accord", year=2021, color="Blue", price=25000, mileage=10000, fuel_type="Diesel", transmission="Manual", registration_number="9167DDH"),
            Car(brand="Honda", model="Civic", year=2019, color="Black", price=22000, mileage=12000, fuel_type="Petrol", transmission="Automatic", registration_number="9540JKM"),
            Car(brand="Ford", model="Focus", year=2018, color="White", price=18000, mileage=20000, fuel_type="Petrol", transmission="Manual", registration_number="0288LHL"),
        ]
        db.add_all(cars)
        db.commit()
    db.close()