from typing import Optional

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Fetch user by ID."""
    stmt = select(User).where(User.id == user_id)
    return db.execute(stmt).scalar_one_or_none()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Fetch user by email address."""
    stmt = select(User).where(User.email == email)
    return db.execute(stmt).scalar_one_or_none()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Fetch user by username."""
    stmt = select(User).where(User.username == username)
    return db.execute(stmt).scalar_one_or_none()


def create_user(db: Session, user_in: UserCreate) -> User:
    """
    Creates a new user in the database.
    Hashes the plain password before saving.
    """
    hashed_pw = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=hashed_pw,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(
    db: Session,
    username_or_email: str,
    password: str,
) -> Optional[User]:
    """
    Authenticates a user by matching username or email and verifying password hash.
    """
    stmt = select(User).where(
        or_(
            User.email == username_or_email,
            User.username == username_or_email,
        )
    )
    user = db.execute(stmt).scalar_one_or_none()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
