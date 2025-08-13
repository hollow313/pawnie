from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Text, DateTime, func

Base = declarative_base()

class Setting(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True)
    key = Column(String(100), unique=True, index=True)
    value = Column(Text, nullable=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(320), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(200), default="")
    address = Column(String(255), default="")
    city = Column(String(100), default=""
)
    phone = Column(String(50), default="")
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

class Animal(Base):
    __tablename__ = "animals"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    name = Column(String(100), nullable=False)
    species = Column(String(50), nullable=False)
    breed = Column(String(100), default="")
    age_months = Column(Integer, default=0)
    avatar_url = Column(String(255), default="")

class Listing(Base):
    __tablename__ = "listings"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    animal_id = Column(Integer, ForeignKey("animals.id"), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    type = Column(String(30), nullable=False)   # sale/breeding
    species = Column(String(50), nullable=False)
    price = Column(Float, default=0.0)          # <— nouvel attribut
    images = Column(Text, default="")           # CSV de paths
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

class MessageThread(Base):
    __tablename__ = "message_threads"
    id = Column(Integer, primary_key=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), index=True, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    thread_id = Column(Integer, ForeignKey("message_threads.id"), index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), index=True)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
