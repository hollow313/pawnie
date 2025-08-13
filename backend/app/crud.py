from sqlalchemy.orm import Session
from typing import Optional, List
from . import models, schemas
from .auth import hash_password
from .utils import slugify

# Users
def create_user(db: Session, data: schemas.UserCreate) -> models.User:
    first = db.query(models.User).count() == 0
    u = models.User(email=data.email, full_name=data.full_name, hashed_password=hash_password(data.password), is_admin=first)
    db.add(u); db.commit(); db.refresh(u); return u

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

# Animals
def create_animal(db: Session, owner_id: int, data: schemas.AnimalCreate) -> models.Animal:
    a = models.Animal(owner_id=owner_id, **data.model_dump())
    db.add(a); db.commit(); db.refresh(a); return a

def list_animals(db: Session, owner_id: Optional[int] = None, q: Optional[str] = None) -> List[models.Animal]:
    qry = db.query(models.Animal)
    if owner_id: qry = qry.filter(models.Animal.owner_id == owner_id)
    if q:
        like = f"%{q}%"
        qry = qry.filter((models.Animal.name.ilike(like)) | (models.Animal.breed.ilike(like)))
    return qry.order_by(models.Animal.created_at.desc()).all()

# Listings
def create_listing(db: Session, owner_id: int, data: schemas.ListingCreate) -> models.Listing:
    payload = data.model_dump(); slug = slugify(payload["title"])
    l = models.Listing(owner_id=owner_id, slug=slug, **payload)
    db.add(l); db.commit(); db.refresh(l); return l

def search_listings(db: Session, type_: Optional[str], species: Optional[str], price_min: Optional[float],
                    price_max: Optional[float], q: Optional[str]) -> List[models.Listing]:
    qry = db.query(models.Listing).filter(models.Listing.is_active == True)
    if type_: qry = qry.filter(models.Listing.type == type_)
    if price_min is not None: qry = qry.filter(models.Listing.price >= price_min)
    if price_max is not None: qry = qry.filter(models.Listing.price <= price_max)
    if q:
        like = f"%{q}%"
        qry = qry.filter((models.Listing.title.ilike(like)) | (models.Listing.description.ilike(like)) | (models.Listing.location.ilike(like)))
    if species:
        qry = qry.join(models.Animal, isouter=True).filter(models.Animal.species == species)
    return qry.order_by(models.Listing.created_at.desc()).all()

def toggle_favorite(db: Session, user_id: int, listing_id: int) -> bool:
    f = db.query(models.Favorite).filter_by(user_id=user_id, listing_id=listing_id).first()
    if f: db.delete(f); db.commit(); return False
    db.add(models.Favorite(user_id=user_id, listing_id=listing_id)); db.commit(); return True

# Messaging
def get_or_create_thread(db: Session, listing_id: int, buyer_id: int, seller_id: int) -> models.Thread:
    t = (db.query(models.Thread)
           .filter_by(listing_id=listing_id, buyer_id=buyer_id, seller_id=seller_id)
           .first())
    if t: return t
    t = models.Thread(listing_id=listing_id, buyer_id=buyer_id, seller_id=seller_id)
    db.add(t); db.commit(); db.refresh(t); return t