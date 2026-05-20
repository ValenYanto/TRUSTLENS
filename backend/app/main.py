from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.dashboard import router as dashboard_router
from app.api.transactions import router as transactions_router
from app.api.alerts import router as alerts_router
from app.api.audit_logs import router as audit_logs_router
from app.api.graph import router as graph_router
from app.api.labels import router as labels_router
from app.api.cross_border import router as cross_border_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION,
    description="TrustLens backend API for real-time financial fraud detection.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # nanti dibatasi saat production
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


app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(transactions_router, prefix="/api/v1")
app.include_router(alerts_router, prefix="/api/v1")
app.include_router(audit_logs_router, prefix="/api/v1")
app.include_router(graph_router, prefix="/api/v1")
app.include_router(labels_router, prefix="/api/v1")
app.include_router(cross_border_router, prefix="/api/v1")