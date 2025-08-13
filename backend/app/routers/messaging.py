from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..deps import get_current_user
from .. import models

router = APIRouter(prefix="/messages", tags=["messages"])

@router.get("/threads")
def my_threads(db: Session = Depends(get_db), user=Depends(get_current_user)):
    rows = db.query(models.MessageThread)\
        .filter((models.MessageThread.buyer_id==user.id) | (models.MessageThread.seller_id==user.id))\
        .order_by(models.MessageThread.created_at.desc()).all()
    return [{"id": r.id, "listing_id": r.listing_id, "buyer_id": r.buyer_id, "seller_id": r.seller_id} for r in rows]

@router.post("/start")
def start_thread(
    listing_id: int = Query(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    listing = db.query(models.Listing).filter_by(id=listing_id).first()
    if not listing or not listing.is_active:
        raise HTTPException(status_code=400, detail="Annonce indisponible")
    if listing.owner_id == user.id:
        raise HTTPException(status_code=400, detail="Impossible de contacter votre propre annonce")
    # thread existant ?
    thr = db.query(models.MessageThread).filter_by(
        listing_id=listing.id, buyer_id=user.id, seller_id=listing.owner_id
    ).first()
    if not thr:
        thr = models.MessageThread(listing_id=listing.id, buyer_id=user.id, seller_id=listing.owner_id)
        db.add(thr); db.commit(); db.refresh(thr)
    return {"id": thr.id}

@router.post("/{thread_id}/send")
def send_message(thread_id: int, body: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    thr = db.query(models.MessageThread).filter_by(id=thread_id).first()
    if not thr or (user.id not in (thr.buyer_id, thr.seller_id)):
        raise HTTPException(status_code=404, detail="Thread introuvable")
    msg = models.Message(thread_id=thread_id, sender_id=user.id, body=body)
    db.add(msg); db.commit()
    return {"ok": True}
