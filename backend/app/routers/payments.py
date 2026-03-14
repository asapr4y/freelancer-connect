from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
import requests
import os
from .. import models
from ..database import get_db

router = APIRouter(prefix="/payments", tags=["Payments"])

PAYMONGO_SECRET_KEY = os.getenv("PAYMONGO_SECRET_KEY")

@router.post("/create-link/{booking_id}")
def create_payment_link(booking_id: UUID, db: Session = Depends(get_db)):

    # Get the booking
    booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status != "pending":
        raise HTTPException(status_code=400, detail="Booking is not pending")

    # Get the freelancer to know the rate
    freelancer = db.query(models.Freelancer).filter(
        models.Freelancer.id == booking.freelancer_id
    ).first()

    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")

    # Calculate amount — PayMongo uses centavos (multiply by 100)
    # Minimum is 10000 centavos = ₱100
    hourly_rate = float(freelancer.hourly_rate or 100)
    amount_in_centavos = int(hourly_rate * 100)

    # Create payment link via PayMongo API
    response = requests.post(
        "https://api.paymongo.com/v1/links",
        json={
            "data": {
                "attributes": {
                    "amount": amount_in_centavos,
                    "description": f"Booking payment for {freelancer.category} service",
                    "remarks": str(booking_id)
                }
            }
        },
        auth=(PAYMONGO_SECRET_KEY, "")
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail="Failed to create payment link"
        )

    data = response.json()
    checkout_url = data["data"]["attributes"]["checkout_url"]

    return {
        "checkout_url": checkout_url,
        "amount": hourly_rate,
        "booking_id": str(booking_id)
    }


@router.post("/confirm/{booking_id}")
def confirm_payment(booking_id: UUID, db: Session = Depends(get_db)):
    # This manually confirms a booking after payment
    # In production this would be handled by a webhook

    booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = "confirmed"
    db.commit()
    db.refresh(booking)

    return {"message": "Booking confirmed!", "status": booking.status}