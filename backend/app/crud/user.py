from sqlalchemy.orm import Session
from app.models import user as user_model
from app.schemas import user as user_schema
from app.auth.hashing import hash_password

def get_user_by_username(db: Session, username: str):
    return db.query(user_model.User).filter(user_model.User.username == username).first()

def create_user(db: Session, user: user_schema.UserCreate):
    hashed_pw = hash_password(user.password)
    db_user = user_model.User(username=user.username, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
