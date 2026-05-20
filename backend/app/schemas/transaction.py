from uuid import UUID
from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    sender_account_id: UUID
    receiver_account_id: UUID
    device_id: UUID | None = None
    merchant_id: UUID | None = None

    amount: float = Field(..., gt=0)
    currency: str = "IDR"
    channel: str = "mobile_banking"

    source_country: str = "ID"
    destination_country: str = "ID"
    ip_address: str | None = None


class TransactionCreateResponse(BaseModel):
    message: str
    transaction_id: str
    transaction_reference: str
    fraud_score: float
    risk_level: str
    status: str
    alert_created: bool
    ml_model_used: bool = False
    ml_score: float | None = None