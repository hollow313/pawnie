import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..deps import require_admin
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/banner", response_model=schemas.BannerOut)
def get_banner(db: Session = Depends(get_db)):
    text = os.getenv("ADMIN_BANNER", "")
    enabled = (os.getenv("ADMIN_BANNER_ENABLED", "false").lower() == "true")
    # DB override if exists
    kv = db.query(models.Setting).filter_by(key="banner_text").first()
    if kv: text = kv.value or text
    kv2 = db.query(models.Setting).filter_by(key="banner_enabled").first()
    if kv2: enabled = (kv2.value == "true")
    return {"text": text, "enabled": enabled}

@router.post("/banner", response_model=schemas.BannerOut)
def set_banner(text: str, enabled: bool, db: Session = Depends(get_db), admin = Depends(require_admin)):
    up = db.query(models.Setting).filter_by(key="banner_text").first()
    if not up: up = models.Setting(key="banner_text", value=text); db.add(up)
    else: up.value = text
    up2 = db.query(models.Setting).filter_by(key="banner_enabled").first()
    if not up2: up2 = models.Setting(key="banner_enabled", value="true" if enabled else "false"); db.add(up2)
    else: up2.value = "true" if enabled else "false"
    db.commit()
    return {"text": text, "enabled": enabled}

@router.get("/stats", response_model=schemas.StatsOut)
def stats(db: Session = Depends(get_db), admin = Depends(require_admin)):
    users = db.query(models.User).count()
    animals = db.query(models.Animal).count()
    listings = db.query(models.Listing).count()
    messages = db.query(models.Message).count()
    return {"users": users, "animals": animals, "listings": listings, "messages": messages}

@router.post("/moderation/toggle_listing")
def mod_toggle_listing(listing_id: int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    l = db.query(models.Listing).filter_by(id=listing_id).first()
    if not l: return {"ok": False, "reason": "not found"}
    l.is_active = not l.is_active
    db.commit()
    return {"ok": True, "is_active": l.is_active}