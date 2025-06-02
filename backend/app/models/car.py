from sqlalchemy import Column, Integer, String
from app.database import Base

class Car(Base):
    __tablename__ = "cars"
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String)
    model = Column(String)
    year = Column(Integer)
    color = Column(String)
    price = Column(Integer)
    mileage = Column(Integer)
    fuel_type = Column(String)
    transmission = Column(String)
    registration_number = Column(String, unique=True)