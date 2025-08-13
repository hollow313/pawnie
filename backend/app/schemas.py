from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# -------- Users --------
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = ""
    address: Optional[str] = ""
    city: Optional[str] = ""
    phone: Optional[str] = ""

class UserCreate(UserBase):
    password: str = Field(min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6)

class UserOut(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    class Config:
        from_attributes = True

# -------- Animals --------
class AnimalBase(BaseModel):
    name: str
    species: str  # dog/cat/other
    breed: Optional[str] = ""
    age_months: Optional[int] = 0
    avatar_url: Optional[str] = ""

class AnimalCreate(AnimalBase):
    pass

class AnimalUpdate(BaseModel):
    name: Optional[str] = None
    species: Optional[str] = None
    breed: Optional[str] = None
    age_months: Optional[int] = None
    avatar_url: Optional[str] = None

class AnimalOut(AnimalBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

# -------- Listings --------
class ListingBase(BaseModel):
    title: str
    description: str = ""
    type: str  # sale/breeding
    species: str  # dog/cat/other
    price: float = 0.0
    images: List[str] = []

class ListingCreate(ListingBase):
    animal_id: Optional[int] = None

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    species: Optional[str] = None
    price: Optional[float] = None
    images: Optional[List[str]] = None
    is_active: Optional[bool] = None

class ListingOut(ListingBase):
    id: int
    owner_id: int
    is_active: bool
    class Config:
        from_attributes = True

# -------- Admin --------
class BannerOut(BaseModel):
    text: str
    enabled: bool

class StatsOut(BaseModel):
    users: int
    animals: int
    listings: int
    messages: int
