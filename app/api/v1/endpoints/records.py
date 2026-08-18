from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.record import (
    RecordCreate,
    RecordUpdate,
    RecordResponse,
    RecordListResponse,
)
from app.crud import record as crud_record

router = APIRouter()


@router.get("/", response_model=RecordListResponse)
def list_records(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Max records to return per page"),
    search: Optional[str] = Query(None, description="Filter by title or artist"),
    db: Session = Depends(get_db),
):
    """
    Retrieve all records in the crate with pagination and optional search.
    """
    items, total = crud_record.get_records(db, skip=skip, limit=limit, search=search)
    return RecordListResponse(items=items, total=total, skip=skip, limit=limit)


@router.post("/", response_model=RecordResponse, status_code=status.HTTP_201_CREATED)
def create_record(
    record_in: RecordCreate,
    db: Session = Depends(get_db),
):
    """
    Add a new vinyl record to the collection.
    """
    return crud_record.create_record(db, record_in=record_in)


@router.get("/{record_id}", response_model=RecordResponse)
def read_record(
    record_id: int,
    db: Session = Depends(get_db),
):
    """
    Get a single record by its ID.
    """
    record = crud_record.get_record(db, record_id=record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Record with ID {record_id} not found",
        )
    return record


@router.put("/{record_id}", response_model=RecordResponse)
def update_record(
    record_id: int,
    record_in: RecordUpdate,
    db: Session = Depends(get_db),
):
    """
    Update details for a specific record.
    """
    record = crud_record.get_record(db, record_id=record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Record with ID {record_id} not found",
        )
    return crud_record.update_record(db, db_record=record, record_in=record_in)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_record(
    record_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete a record from the collection.
    """
    record = crud_record.get_record(db, record_id=record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Record with ID {record_id} not found",
        )
    crud_record.delete_record(db, db_record=record)
    return None
