from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.api.v1.router import api_router

# Ensure all ORM models are registered with Base metadata before table creation
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Handles startup schema initialization and graceful shutdown tasks.
    """
    # Startup: ensure tables exist
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    description="""
    🎵 **Vinyl Crate API** — Production-ready API for managing vinyl record inventories.
    
    Features:
    - Relational database persistence (SQLAlchemy 2.0 + SQLite / PostgreSQL)
    - User authentication with JWT and bcrypt password hashing
    - Multi-tenant crate isolation (user-owned record collections)
    - Full CRUD support with search and pagination
    """,
    version="1.0.0",
)

# CORS configuration for decoupled frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health"])
def read_root():
    """Root welcoming endpoint."""
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME}.",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint for container orchestration and uptime monitors."""
    return {"status": "healthy"}
