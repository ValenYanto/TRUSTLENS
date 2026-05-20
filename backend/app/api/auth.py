from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse


router = APIRouter(prefix="/auth", tags=["Authentication"])


def serialize_user(user: User) -> dict:
    return {
        "id": str(user.id),
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "institution_name": user.institution_name,
    }


@router.post("/register", response_model=UserResponse)
def register_user(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
):
    allowed_roles = {"ADMIN", "ANALYST", "INSTITUTION"}

    if payload.role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Allowed: {', '.join(sorted(allowed_roles))}",
        )

    existing_user = db.query(User).filter(User.email == payload.email).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
        institution_name=payload.institution_name,
    )

    db.add(user)
    db.flush()

    audit_log = AuditLog(
        actor=payload.email,
        action="register_user",
        entity_type="user",
        entity_id=str(user.id),
        description=f"Registered new user with role {payload.role}.",
    )
    db.add(audit_log)

    db.commit()
    db.refresh(user)

    return serialize_user(user)


@router.post("/login", response_model=TokenResponse)
def login_user(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        subject=str(user.id),
        extra_data={
            "email": user.email,
            "role": user.role,
        },
    )

    audit_log = AuditLog(
        actor=user.email,
        action="login_user",
        entity_type="user",
        entity_id=str(user.id),
        description="User logged in successfully.",
    )
    db.add(audit_log)
    db.commit()

    return TokenResponse(
        access_token=access_token,
        user=serialize_user(user),
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return serialize_user(current_user)