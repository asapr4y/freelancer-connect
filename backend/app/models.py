from sqlalchemy import Column, String, Text, Integer, Boolean
from sqlalchemy import Date, Time, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from .database import Base

class User(Base):
    __tablename__ = "users"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name     = Column(String(100), nullable=False)
    email         = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role          = Column(String(20), nullable=False)
    created_at    = Column(TIMESTAMP, server_default=func.now())


class Freelancer(Base):
    __tablename__ = "freelancers"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    category    = Column(String(100), nullable=False)
    bio         = Column(Text)
    skills      = Column(Text)
    hourly_rate = Column(DECIMAL(10, 2))
    location    = Column(String(100))
    created_at  = Column(TIMESTAMP, server_default=func.now())


class Availability(Base):
    __tablename__ = "availability"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    freelancer_id  = Column(UUID(as_uuid=True), ForeignKey("freelancers.id", ondelete="CASCADE"))
    available_date = Column(Date, nullable=False)
    slot_start     = Column(Time, nullable=False)
    slot_end       = Column(Time, nullable=False)
    is_booked      = Column(Boolean, default=False)


class Booking(Base):
    __tablename__ = "bookings"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id     = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    freelancer_id = Column(UUID(as_uuid=True), ForeignKey("freelancers.id"))
    booking_date  = Column(Date, nullable=False)
    start_time    = Column(Time, nullable=False)
    end_time      = Column(Time, nullable=False)
    status        = Column(String(20), default="pending")
    notes         = Column(Text)
    created_at    = Column(TIMESTAMP, server_default=func.now())


class Review(Base):
    __tablename__ = "reviews"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id    = Column(UUID(as_uuid=True), ForeignKey("bookings.id"))
    reviewer_id   = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    freelancer_id = Column(UUID(as_uuid=True), ForeignKey("freelancers.id"))
    rating        = Column(Integer, nullable=False)
    comment       = Column(Text)
    created_at    = Column(TIMESTAMP, server_default=func.now())