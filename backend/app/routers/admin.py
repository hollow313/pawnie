import os
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from ..deps import require_admin
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/admin", tags=["admin"])

# --------- Bannière ----------
@router.get("/banner", response_model=schemas.BannerOut)
def get_banner(db: Session = Depends(get_db)):
    text = os.getenv("ADMIN_BANNER", "")
    enabled = (os.getenv("ADMIN_BANNER_ENABLED", "false").lower() == "true")
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

# --------- Stats ----------
@router.get("/stats", response_model=schemas.StatsOut)
def stats(db: Session = Depends(get_db), admin = Depends(require_admin)):
    users = db.query(models.User).count()
    animals = db.query(models.Animal).count()
    listings = db.query(models.Listing).count()
    messages = db.query(models.Message).count()
    return {"users": users, "animals": animals, "listings": listings, "messages": messages}

# --------- Modération Annonce ----------
@router.post("/moderation/toggle_listing")
def mod_toggle_listing(listing_id: int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    l = db.query(models.Listing).filter_by(id=listing_id).first()
    if not l: return {"ok": False, "reason": "not found"}
    l.is_active = not l.is_active
    db.commit()
    return {"ok": True, "is_active": l.is_active}

# --------- Paramètres génériques (whitelist simple) ----------
ALLOWED_SETTINGS = {"banner_text", "banner_enabled", "site_title", "upload_max_mb", "default_page_size"}

@router.get("/settings")
def get_settings(db: Session = Depends(get_db), admin = Depends(require_admin)):
    rows = db.query(models.Setting).all()
    out: Dict[str, Any] = {}
    for r in rows:
        if r.key in ALLOWED_SETTINGS:
            out[r.key] = r.value
    return out

@router.post("/settings")
def set_settings(payload: Dict[str, Any], db: Session = Depends(get_db), admin = Depends(require_admin)):
    for k, v in payload.items():
        if k not in ALLOWED_SETTINGS:
            continue
        row = db.query(models.Setting).filter_by(key=k).first()
        if not row:
            row = models.Setting(key=k, value=str(v))
            db.add(row)
        else:
            row.value = str(v)
    db.commit()
    return {"ok": True}

# --------- Gestion Utilisateurs ----------
class UserAdminOut(schemas.UserOut):
    pass

@router.get("/users", response_model=List[UserAdminOut])
def list_users(
    q: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    admin = Depends(require_admin)
):
    qry = db.query(models.User)
    if q:
        like = f"%{q}%"
        qry = qry.filter((models.User.email.ilike(like)) | (models.User.full_name.ilike(like)))
    users = qry.order_by(models.User.created_at.desc()).all()
    return users[offset: offset + limit]

@router.patch("/users/{user_id}", response_model=UserAdminOut)
def update_user_admin(
    user_id: int,
    is_active: Optional[bool] = None,
    is_admin: Optional[bool] = None,
    full_name: Optional[str] = None,
    db: Session = Depends(get_db),
    admin = Depends(require_admin)
):
    u = db.query(models.User).filter_by(id=user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    if full_name is not None:
        u.full_name = full_name
    if is_active is not None:
        u.is_active = is_active
    if is_admin is not None:
        u.is_admin = is_admin
    db.commit(); db.refresh(u); return u
