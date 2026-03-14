from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/freelancers", tags=["Freelancers"])

@router.post("/", response_model=schemas.FreelancerOut)
def create_freelancer(
    user_id: UUID,
    data: schemas.FreelancerCreate,
    db: Session = Depends(get_db)
):
    # Make sure the user exists and is actually a freelancer
    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role != "freelancer":
        raise HTTPException(status_code=403, detail="User is not a freelancer")

    profile = models.Freelancer(user_id=user_id, **data.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/", response_model=list[schemas.FreelancerOut])
def get_freelancers(
    category: str = None,
    db: Session = Depends(get_db)
):
    # Optional filtering by category e.g. /freelancers?category=Photography
    query = db.query(models.Freelancer)
    if category:
        query = query.filter(models.Freelancer.category == category)
    return query.all()


@router.get("/{freelancer_id}", response_model=schemas.FreelancerOut)
def get_freelancer(freelancer_id: UUID, db: Session = Depends(get_db)):
    freelancer = db.query(models.Freelancer).filter(
        models.Freelancer.id == freelancer_id
    ).first()

    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")

    return freelancer

@router.get("/user/{user_id}", response_model=schemas.FreelancerOut)
def get_freelancer_by_user(user_id: UUID, db: Session = Depends(get_db)):
    freelancer = db.query(models.Freelancer).filter(
        models.Freelancer.user_id == user_id
    ).first()

    if not freelancer:
        raise HTTPException(
            status_code=404,
            detail="Freelancer profile not found"
        )

    return freelancer

@router.put("/user/{user_id}", response_model=schemas.FreelancerOut)
def update_freelancer(
    user_id: UUID,
    data: schemas.FreelancerCreate,
    db: Session = Depends(get_db)
):
    freelancer = db.query(models.Freelancer).filter(
        models.Freelancer.user_id == user_id
    ).first()

    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer profile not found")

    for key, value in data.model_dump().items():
        setattr(freelancer, key, value)

    db.commit()
    db.refresh(freelancer)
    return freelancer