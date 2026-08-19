from typing import List, Optional, Tuple

from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session

from app.models.record import Record
from app.schemas.record import RecordCreate, RecordUpdate


def get_record(db: Session, record_id: int, user_id: int) -> Optional[Record]:
    """
    Fetch a single record by primary key ID and user ID.
    Ensures users can only access their own records.
    """
    stmt = select(Record).where(
        and_(
            Record.id == record_id,
            Record.user_id == user_id,
        )
    )
    return db.execute(stmt).scalar_one_or_none()


def get_records(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
) -> Tuple[List[Record], int]:
    """
    Fetch a paginated list of records belonging exclusively to `user_id`.
    Supports optional search filter on title and artist.
    """
    # Base query filtered by user_id
    base_conditions = [Record.user_id == user_id]

    if search:
        search_filter = or_(
            Record.title.ilike(f"%{search}%"),
            Record.artist.ilike(f"%{search}%"),
        )
        base_conditions.append(search_filter)

    combined_filter = and_(*base_conditions)

    # Count total for this user
    count_query = select(func.count(Record.id)).where(combined_filter)
    total = db.execute(count_query).scalar_one()

    # Fetch paginated slice
    query = (
        select(Record).where(combined_filter).order_by(Record.id.desc()).offset(skip).limit(limit)
    )
    records = list(db.execute(query).scalars().all())

    return records, total


def create_record(db: Session, record_in: RecordCreate, user_id: int) -> Record:
    """
    Create a new record assigned to the authenticated user's crate.
    """
    data = record_in.model_dump()
    data["user_id"] = user_id
    db_record = Record(**data)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def update_record(db: Session, db_record: Record, record_in: RecordUpdate) -> Record:
    """
    Update fields of an existing record.
    """
    update_data = record_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_record, field, value)

    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def delete_record(db: Session, db_record: Record) -> None:
    """
    Delete a record from the collection.
    """
    db.delete(db_record)
    db.commit()
