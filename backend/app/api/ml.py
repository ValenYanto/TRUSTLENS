from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.ml.baseline_model import FraudBaselineModel, get_model_status
from app.ml.registry.model_registry import get_active_metrics, list_model_artifacts
from app.ml.training.train_paysim import train_paysim_logistic, train_paysim_xgboost
from app.models.transaction import Transaction
from app.ml.continual.adaptive_trainer import (
    get_adaptive_learning_status,
    run_adaptive_retraining,
)
from app.ml.training.train_trustlens import train_trustlens_adaptive_model

router = APIRouter(prefix="/ml", tags=["Machine Learning"])


@router.get("/status")
def ml_status():
    active_metrics = get_active_metrics()

    return {
        "baseline_model": get_model_status(),
        "active_tabular_model": active_metrics,
    }


@router.get("/metrics")
def get_ml_metrics():
    active_metrics = get_active_metrics()

    if not active_metrics:
        return {
            "model_available": False,
            "message": "No trained tabular model available yet.",
        }

    return {
        "model_available": True,
        "active_model": active_metrics,
    }


@router.get("/models")
def get_ml_models():
    return {
        "items": list_model_artifacts(),
    }


@router.post("/train-baseline")
def train_baseline_model(db: Session = Depends(get_db)):
    transactions = (
        db.query(Transaction)
        .order_by(Transaction.transaction_time.desc())
        .limit(1000)
        .all()
    )

    try:
        model = FraudBaselineModel()
        result = model.train(transactions)
        return result

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/train/paysim")
def train_paysim_model(
    model: str = Query(default="xgboost", pattern="^(xgboost|logistic)$"),
    limit_rows: int | None = Query(default=None, ge=10000),
):
    try:
        if model == "logistic":
            result = train_paysim_logistic(limit_rows=limit_rows)
        else:
            result = train_paysim_xgboost(limit_rows=limit_rows)

        return {
            "message": "PaySim model trained successfully",
            "result": result,
        }

    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    
@router.get("/adaptive/status")
def adaptive_learning_status(db: Session = Depends(get_db)):
    return get_adaptive_learning_status(db)


@router.post("/adaptive/retrain")
def adaptive_retrain(
    force: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    try:
        return run_adaptive_retraining(db=db, force=force)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    
@router.post("/train/trustlens")
def train_trustlens_model(
    min_samples: int = Query(default=10, ge=2),
    db: Session = Depends(get_db),
):
    try:
        result = train_trustlens_adaptive_model(
            db=db,
            min_samples=min_samples,
        )

        return {
            "message": "TrustLens internal adaptive model trained successfully",
            "result": result,
        }

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))