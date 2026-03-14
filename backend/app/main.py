from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import users, freelancers, bookings, reviews, payments

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Freelancer Connect API",
    description="A marketplace for booking freelancers",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(freelancers.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(payments.router)

@app.get("/")
def root():
    return {"message": "Freelancer Connect API is running!"}