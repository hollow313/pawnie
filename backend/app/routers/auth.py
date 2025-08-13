from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models
from ..database import get_db, Base, engine
from ..crud import create_user, get_user_by_email
from ..auth import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])
Base.metadata.create_all(bind=engine)

@router.post("/register", response_model=schemas.UserOut)
def register(data: schemas.UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    return create_user(db, data)

@router.post("/login", response_model=schemas.Token)
def login(form: schemas.UserCreate, db: Session = Depends(get_db)):
    user = get_user_by_email(db, form.email)
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    token = create_access_token(sub=user.email)
    return {"access_token": token}