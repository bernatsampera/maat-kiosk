"""Main FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.chat_router import router as chat_router

app = FastAPI(
    title="Check In Mat",
    description="FAstapi endpoints to check in to mats",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint to check API health."""
    return {"message": "Check in Mat"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


class ChatRequest(BaseModel):
    message: str


app.include_router(chat_router)
