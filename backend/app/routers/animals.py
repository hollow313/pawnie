from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from ..deps import get_current_user
from ..database import get_db
from .. import schemas, models
from ..crud import create_animal, list_animals

router = APIRouter(prefix="/animals", tags=["animals"])

@router.post("", response_model=schemas.AnimalOut)
def create(data: schemas.AnimalCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return create_animal(db, user.id, data)

@router.get("", response_model=List[schemas.AnimalOut])
def list_mine(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return list_animals(db, owner_id=user.id)

@router.get("/search", response_model=List[schemas.AnimalOut])
def search(q: Optional[str] = None, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return list_animals(db, owner_id=None, q=q)