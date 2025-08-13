from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(min_length=6)

class UserOut(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    class Config:
        from_attributes = True

# Animals
class AnimalBase(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None
    sex: Optional[str] = None
    age_months: Optional[int] = 0
    description: Optional[str] = None
    photo_url: Optional[str] = None

class AnimalCreate(AnimalBase):
    pass

class AnimalOut(AnimalBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

# Listings
class ListingBase(BaseModel):
    title: str
    type: str
    price: float = 0.0
    location: Optional[str] = None
    description: Optional[str] = None
    photo_url: Optional[str] = None
    animal_id: Optional[int] = None

class ListingCreate(ListingBase):
    pass

class ListingOut(ListingBase):
    id: int
    owner_id: int
    slug: Optional[str] = None
    is_active: bool
    class Config:
        from_attributes = True

class FavoriteOut(BaseModel):
    id: int
    user_id: int
    listing_id: int
    class Config:
        from_attributes = True

# Messaging
class ThreadOut(BaseModel):
    id: int
    listing_id: int
    buyer_id: int
    seller_id: int
    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    thread_id: int
    body: str

class MessageOut(BaseModel):
    id: int
    thread_id: int
    sender_id: int
    body: str
    class Config:
        from_attributes = True

# Admin
class BannerOut(BaseModel):
    text: str
    enabled: bool

class StatsOut(BaseModel):
    users: int
    animals: int
    listings: int
    messages: int