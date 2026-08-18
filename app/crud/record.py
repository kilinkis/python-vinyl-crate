from typing import Optional, List, Tuple
from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session

from app.models.record import Record
from app.schemas.record import RecordCreate, RecordUpdate


def get_record(db: Session, record_id: int) -> Optional[Record]:
    """
    Fetch a single record by primary key ID.
    
    Analogy:
    - Node.js / Prisma: prisma.record.findUnique({ where: { id: record_id } })
    - PHP / Laravel: Record::find($record_id)
    """
    stmt = select(Record).where(Record.id == record_id)
    return db.execute(stmt).scalar_one_or_none()


def get_records(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
) -> Tuple[List[Record], int]:
    """
    Fetch a paginated list of records with optional search filter on title and artist.
    Returns (records, total_count).
    """
    # Base query for records
    query = select(Record)
    
    # Base query for total count (needed for pagination metadata)
    count_query = select(func.count(Record.id))

    if search:
        search_filter = or_(
            Record.title.ilike(f"%{search}%"),
            Record.artist.ilike(f"%{search}%"),
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    # Calculate total matching records
    total = db.execute(count_query).scalar_one()

    # Apply pagination and sorting (newest first)
    query = query.order_by(Record.id.desc()).offset(skip).limit(limit)
    records = list(db.execute(query).scalars().all())

    return records, total


def create_record(db: Session, record_in: RecordCreate) -> Record:
    """
    Create a new record in the database.
    
    Analogy:
    - Node.js / Prisma: prisma.record.create({ data: record_in })
    - PHP / Laravel: Record::create($request->validated())
    """
    # Convert Pydantic model to dictionary and unpack into SQLAlchemy model
    db_record = Record(**record_in.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)  # Reload attributes (id, timestamps) populated by DB
    return db_record


def update_record(db: Session, db_record: Record, record_in: RecordUpdate) -> Record:
    """
    Update fields of an existing record (partial update / PATCH / PUT).
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
    Delete a record from the database.
    """
    db.delete(db_record)
    db.commit()
