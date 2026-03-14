from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/", response_model=schemas.BookingOut)
def create_booking(
    client_id: UUID,
    data: schemas.BookingCreate,
    db: Session = Depends(get_db)
):
    # Check if client exists
    client = db.query(models.User).filter(
        models.User.id == client_id
    ).first()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Check if freelancer exists
    freelancer = db.query(models.Freelancer).filter(
        models.Freelancer.id == data.freelancer_id
    ).first()

    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")

    # Check for double bookings — this is the most important part!
    conflict = db.query(models.Booking).filter(
        models.Booking.freelancer_id == data.freelancer_id,
        models.Booking.booking_date  == data.booking_date,
        models.Booking.status        != "cancelled",
        models.Booking.start_time    < data.end_time,
        models.Booking.end_time      > data.start_time
    ).first()

    if conflict:
        raise HTTPException(
            status_code=400,
            detail="This time slot is already booked"
        )

    booking = models.Booking(client_id=client_id, **data.model_dump())
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/", response_model=list[schemas.BookingOut])
def get_bookings(db: Session = Depends(get_db)):
    return db.query(models.Booking).all()


@router.get("/client/{client_id}", response_model=list[schemas.BookingOut])
def get_client_bookings(client_id: UUID, db: Session = Depends(get_db)):
    # Get all bookings made by a specific client
    return db.query(models.Booking).filter(
        models.Booking.client_id == client_id
    ).all()


@router.get("/freelancer/{freelancer_id}", response_model=list[schemas.BookingOut])
def get_freelancer_bookings(freelancer_id: UUID, db: Session = Depends(get_db)):
    # Get all bookings received by a specific freelancer
    return db.query(models.Booking).filter(
        models.Booking.freelancer_id == freelancer_id
    ).all()


@router.patch("/{booking_id}/status", response_model=schemas.BookingOut)
def update_booking_status(
    booking_id: UUID,
    status: str,
    db: Session = Depends(get_db)
):
    # Freelancer can confirm or cancel a booking
    booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    allowed = ["pending", "confirmed", "cancelled", "completed"]
    if status not in allowed:
        raise HTTPException(status_code=400, detail=f"Status must be one of {allowed}")

    booking.status = status
    db.commit()
    db.refresh(booking)
    return booking