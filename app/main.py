from fastapi import FastAPI
from app.core.config import settings
from app.auth.jwt import create_access_token
from app.api.facilities import router as facility_router
from app.api.slots import router as slot_router
from app.api.bookings import router as booking_router
from app.api.availability import router as availability_router
from app.chat.router import router as chat_router

from app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title=settings.project_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development ONLY
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(facility_router)
app.include_router(slot_router)
app.include_router(booking_router)
app.include_router(availability_router) 
app.include_router(auth_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {"message": "FastAPI backend is running"}
@app.get("/v1/models")
def list_models():
    return {
        "data": [
            {"id": "ollama-mistral", "object": "model"}
        ]
    }
