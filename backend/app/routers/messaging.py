from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..deps import get_current_user
from ..database import get_db
from .. import models, schemas
from ..crud import get_or_create_thread

router = APIRouter(prefix="/messages", tags=["messages"])

@router.post("/start", response_model=schemas.ThreadOut)
def start_thread(listing_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    listing = db.query(models.Listing).filter_by(id=listing_id).first()
    if not listing or not listing.is_active:
        raise HTTPException(status_code=404, detail="Annonce introuvable")
    if listing.owner_id == user.id:
        raise HTTPException(status_code=400, detail="Impossible avec votre propre annonce")
    t = get_or_create_thread(db, listing_id=listing.id, buyer_id=user.id, seller_id=listing.owner_id)
    return t

@router.get("/threads", response_model=List[schemas.ThreadOut])
def my_threads(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return (db.query(models.Thread)
              .filter((models.Thread.buyer_id == user.id) | (models.Thread.seller_id == user.id))
              .order_by(models.Thread.created_at.desc()).all())

@router.get("/thread/{thread_id}", response_model=List[schemas.MessageOut])
def list_messages(thread_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    t = db.query(models.Thread).filter_by(id=thread_id).first()
    if not t or (user.id not in [t.buyer_id, t.seller_id]):
        raise HTTPException(status_code=404, detail="Thread introuvable")
    msgs = (db.query(models.Message)
              .filter_by(thread_id=thread_id)
              .order_by(models.Message.created_at.asc()).all())
    return msgs

@router.post("/send", response_model=schemas.MessageOut)
def send_message(payload: schemas.MessageCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    t = db.query(models.Thread).filter_by(id=payload.thread_id).first()
    if not t or (user.id not in [t.buyer_id, t.seller_id]):
        raise HTTPException(status_code=404, detail="Thread introuvable")
    m = models.Message(thread_id=t.id, sender_id=user.id, body=payload.body)
    db.add(m); db.commit(); db.refresh(m); return m