from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..deps import get_current_user
from ..database import get_db
from .. import models, schemas
from ..crud import toggle_favorite

router = APIRouter(prefix="/favorites", tags=["favorites"])

@router.post("/{listing_id}")
def toggle(listing_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    state = toggle_favorite(db, user.id, listing_id)
    return {"favorite": state}

@router.get("", response_model=List[schemas.ListingOut])
def list_favs(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    qry = (db.query(models.Listing)
             .join(models.Favorite, models.Favorite.listing_id == models.Listing.id)
             .filter(models.Favorite.user_id == user.id))
    return qry.all()