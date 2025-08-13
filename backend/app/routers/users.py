from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from ..database import get_db
from .. import models, schemas
from ..deps import get_current_user

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=schemas.UserOut)
def me(user: models.User = Depends(get_current_user)):
    return user

@router.patch("/me", response_model=schemas.UserOut)
def update_me(
    patch: schemas.UserUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    for k, v in patch.model_dump(exclude_unset=True).items():
        setattr(user, k, v)
    db.commit(); db.refresh(user); return user

@router.post("/me/password")
def change_password(
    body: schemas.PasswordChange,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    if not pwd.verify(body.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect")
    user.password_hash = pwd.hash(body.new_password)
    db.commit()
    return {"ok": True}
