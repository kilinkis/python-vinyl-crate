import logging

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.record import Record
from app.models.user import User

logger = logging.getLogger("vinyl_crate.init_db")

DEMO_USER_USERNAME = "vinyl_fan"
DEMO_USER_EMAIL = "collector@crate.com"
DEMO_USER_PASSWORD = "secretpassword123"

SAMPLE_RECORDS = [
    {
        "title": "Kind of Blue",
        "artist": "Miles Davis",
        "release_year": 1959,
        "condition": "Mint",
        "price": 65.00,
        "cover_url": "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg",
    },
    {
        "title": "Random Access Memories",
        "artist": "Daft Punk",
        "release_year": 2013,
        "condition": "Near Mint",
        "price": 45.00,
        "cover_url": "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
    },
    {
        "title": "The Dark Side of the Moon",
        "artist": "Pink Floyd",
        "release_year": 1973,
        "condition": "Near Mint",
        "price": 55.00,
        "cover_url": "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
    },
    {
        "title": "Rumours",
        "artist": "Fleetwood Mac",
        "release_year": 1977,
        "condition": "VG+",
        "price": 38.00,
        "cover_url": "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG",
    },
    {
        "title": "Blue Train",
        "artist": "John Coltrane",
        "release_year": 1958,
        "condition": "Near Mint",
        "price": 52.00,
        "cover_url": "https://upload.wikimedia.org/wikipedia/en/6/68/John_Coltrane_-_Blue_Train.jpg",
    },
    {
        "title": "Abbey Road",
        "artist": "The Beatles",
        "release_year": 1969,
        "condition": "Mint",
        "price": 49.00,
        "cover_url": "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
    },
]


def init_db(db: Session) -> None:
    """
    Initializes database with default demo user and initial sample records if not present.
    """
    user = db.query(User).filter(User.username == DEMO_USER_USERNAME).first()
    if not user:
        logger.info(f"Seeding demo user '{DEMO_USER_USERNAME}' ({DEMO_USER_EMAIL})...")
        user = User(
            email=DEMO_USER_EMAIL,
            username=DEMO_USER_USERNAME,
            hashed_password=get_password_hash(DEMO_USER_PASSWORD),
            is_active=True,
            is_superuser=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        logger.info(f"Seeding {len(SAMPLE_RECORDS)} sample vinyl records for demo user...")
        for item in SAMPLE_RECORDS:
            record = Record(
                title=item["title"],
                artist=item["artist"],
                release_year=item["release_year"],
                condition=item["condition"],
                price=item["price"],
                cover_url=item["cover_url"],
                user_id=user.id,
            )
            db.add(record)
        db.commit()
        logger.info("Database seeding complete.")
