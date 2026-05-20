from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.db.session import get_db
from app.models.transaction import Transaction
from app.models.alert import Alert
from app.models.account import Account
from app.models.device import Device
from app.models.merchant import Merchant


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_transactions = db.query(Transaction).count()
    total_accounts = db.query(Account).count()
    total_devices = db.query(Device).count()
    total_merchants = db.query(Merchant).count()

    total_alerts = db.query(Alert).count()
    open_alerts = db.query(Alert).filter(Alert.status == "open").count()
    high_risk_transactions = db.query(Transaction).filter(Transaction.risk_level == "high").count()
    blocked_transactions = db.query(Transaction).filter(Transaction.status == "blocked").count()

    avg_fraud_score = db.query(func.avg(Transaction.fraud_score)).scalar() or 0

    risk_distribution = {
        "low": db.query(Transaction).filter(Transaction.risk_level == "low").count(),
        "medium": db.query(Transaction).filter(Transaction.risk_level == "medium").count(),
        "high": db.query(Transaction).filter(Transaction.risk_level == "high").count(),
    }

    status_distribution = {
        "approved": db.query(Transaction).filter(Transaction.status == "approved").count(),
        "flagged": db.query(Transaction).filter(Transaction.status == "flagged").count(),
        "blocked": db.query(Transaction).filter(Transaction.status == "blocked").count(),
        "pending": db.query(Transaction).filter(Transaction.status == "pending").count(),
    }

    return {
        "total_transactions": total_transactions,
        "total_accounts": total_accounts,
        "total_devices": total_devices,
        "total_merchants": total_merchants,
        "total_alerts": total_alerts,
        "open_alerts": open_alerts,
        "high_risk_transactions": high_risk_transactions,
        "blocked_transactions": blocked_transactions,
        "average_fraud_score": round(float(avg_fraud_score), 2),
        "risk_distribution": risk_distribution,
        "status_distribution": status_distribution,
    }


@router.get("/recent-alerts")
def get_recent_alerts(db: Session = Depends(get_db)):
    alerts = (
        db.query(Alert)
        .order_by(Alert.created_at.desc())
        .limit(10)
        .all()
    )

    return [
        {
            "id": str(alert.id),
            "transaction_id": str(alert.transaction_id),
            "alert_type": alert.alert_type,
            "severity": alert.severity,
            "risk_score": alert.risk_score,
            "reason": alert.reason,
            "status": alert.status,
            "assigned_to": alert.assigned_to,
            "created_at": alert.created_at,
        }
        for alert in alerts
    ]