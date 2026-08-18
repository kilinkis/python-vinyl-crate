from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Record(Base):
    """
    SQLAlchemy ORM Model representing the 'records' table.

    Analogies:
    - Node.js / Prisma: Similar to a model defined in schema.prisma (`model Record { ... }`)
    - PHP / Laravel: Similar to an Eloquent Model mapped to a migration schema.
    """
    __tablename__ = "records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    artist: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    release_year: Mapped[int] = mapped_column(Integer, nullable=False)
    condition: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # e.g., 'Mint', 'VG+', 'Good'
    price: Mapped[float] = mapped_column(Float, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
