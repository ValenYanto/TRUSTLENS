from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION,
    description="TrustLens backend API for real-time financial fraud detection.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # nanti kita batasi saat production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "TrustLens API is running",
        "status": "ok",
        "version": settings.API_VERSION,
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "trustlens-backend",
    }