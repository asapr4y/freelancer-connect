from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, time
from uuid import UUID

# --- USER SCHEMAS ---
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str

class UserOut(BaseModel):
    id: UUID
    full_name: str
    email: str
    role: str

    class Config:
        from_attributes = True


# --- FREELANCER SCHEMAS ---
class FreelancerCreate(BaseModel):
    category: str
    bio: Optional[str] = None
    skills: Optional[str] = None
    hourly_rate: Optional[float] = None
    location: Optional[str] = None

class FreelancerOut(FreelancerCreate):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True


# --- BOOKING SCHEMAS ---
class BookingCreate(BaseModel):
    freelancer_id: UUID
    booking_date: date
    start_time: time
    end_time: time
    notes: Optional[str] = None

class BookingOut(BookingCreate):
    id: UUID
    client_id: UUID
    status: str

    class Config:
        from_attributes = True


# --- REVIEW SCHEMAS ---
class ReviewCreate(BaseModel):
    booking_id: UUID
    freelancer_id: UUID
    rating: int
    comment: Optional[str] = None

class ReviewOut(ReviewCreate):
    id: UUID
    reviewer_id: UUID

    class Config:
        from_attributes = True

# --- LOGIN SCHEMA ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str        