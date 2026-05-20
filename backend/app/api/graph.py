from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.transaction import Transaction
from app.services.graph_sync import clear_graph, get_graph_data, sync_transaction_to_graph


router = APIRouter(prefix="/graph", tags=["Graph Explorer"])


@router.post("/sync")
def sync_graph_from_postgres(db: Session = Depends(get_db)):
    transactions = (
        db.query(Transaction)
        .order_by(Transaction.transaction_time.desc())
        .limit(200)
        .all()
    )

    try:
        clear_graph()

        for transaction in transactions:
            sync_transaction_to_graph(transaction)

    except Exception as exc:
        return {
            "message": "Graph sync failed",
            "error": str(exc),
            "synced_transactions": 0,
        }

    return {
        "message": "Graph synced successfully",
        "synced_transactions": len(transactions),
    }


@router.get("")
def get_graph(
    limit: int = Query(default=50, ge=1, le=200),
    risk_level: str | None = Query(default=None),
):
    return get_graph_data(limit=limit, risk_level=risk_level)