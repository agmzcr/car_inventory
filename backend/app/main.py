from fastapi import FastAPI
from app.routers import auth, cars
from app.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.init_cars import init_cars
from fastapi.security import OAuth2PasswordBearer
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from app.auth.jwt import decode_access_token

Base.metadata.create_all(bind=engine)

init_cars()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

app = FastAPI()

security = HTTPBearer()

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    return payload

# Routers
app.include_router(auth.router, prefix="/api")
app.include_router(cars.router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
