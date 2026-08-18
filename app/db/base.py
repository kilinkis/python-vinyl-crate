from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    SQLAlchemy Declarative Base.
    Serves as the root class for all ORM models.
    Similar to Prisma schema model definitions or Eloquent's Illuminate\Database\Eloquent\Model.
    """
    pass
