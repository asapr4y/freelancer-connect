from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("/", response_model=schemas.ReviewOut)
def create_review(
    reviewer_id: UUID,
    data: schemas.ReviewCreate,
    db: Session = Depends(get_db)
):
    # Check if booking exists and is completed
    booking = db.query(models.Booking).filter(
        models.Booking.id == data.booking_id,
        models.Booking.status == "completed"
    ).first()

    if not booking:
        raise HTTPException(
            status_code=400,
            detail="Can only review completed bookings"
        )

    # Check if reviewer is the actual client of this booking
    if booking.client_id != reviewer_id:
        raise HTTPException(
            status_code=403,
            detail="You can only review your own bookings"
        )

    # Check if review already exists for this booking
    existing = db.query(models.Review).filter(
        models.Review.booking_id == data.booking_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="You already reviewed this booking"
        )

    # Validate rating range
    if not (1 <= data.rating <= 5):
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )

    review = models.Review(reviewer_id=reviewer_id, **data.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/freelancer/{freelancer_id}", response_model=list[schemas.ReviewOut])
def get_freelancer_reviews(freelancer_id: UUID, db: Session = Depends(get_db)):
    # Get all reviews for a specific freelancer
    reviews = db.query(models.Review).filter(
        models.Review.freelancer_id == freelancer_id
    ).all()

    if not reviews:
        raise HTTPException(
            status_code=404,
            detail="No reviews found for this freelancer"
        )

    return reviews


@router.get("/booking/{booking_id}", response_model=schemas.ReviewOut)
def get_booking_review(booking_id: UUID, db: Session = Depends(get_db)):
    # Get the review for a specific booking
    review = db.query(models.Review).filter(
        models.Review.booking_id == booking_id
    ).first()

    if not review:
        raise HTTPException(
            status_code=404,
            detail="No review found for this booking"
        )

    return review