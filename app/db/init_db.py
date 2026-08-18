from app.db.base import Base
from app.db.session import engine
import app.models  # noqa: F401 (ensure models are loaded)


def init_db() -> None:
    """
    Initializes database tables.
    Equivalent to running `npx prisma db push` (Node.js) or `php artisan migrate` (Laravel).
    """
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    print("Creating database tables...")
    init_db()
    print("Database tables created successfully.")
