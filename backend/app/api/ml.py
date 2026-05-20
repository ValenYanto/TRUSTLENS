from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.ml.baseline_model import FraudBaselineModel, get_model_status
from app.models.transaction import Transaction


router = APIRouter(prefix="/ml", tags=["Machine Learning"])


@router.get("/status")
def ml_status():
    return get_model_status()


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