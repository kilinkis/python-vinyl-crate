from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.api.v1.router import api_router

# Ensure all ORM models are registered with Base metadata before creating tables
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI Lifespan Context Manager.
    Handles application startup and shutdown events.
    
    Analogy:
    - Node.js / Express: Server listen callback & process.on('SIGTERM')
    - PHP / Laravel: AppServiceProvider boot() and terminate()
    """
    # Startup: create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: cleanup operations (if any)


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    description="""
    🎵 **Vinyl Crate API** — A production-ready API for managing vinyl record inventories.
    
    Features:
    - Relational database persistence (SQLAlchemy 2.0 + SQLite/PostgreSQL)
    - Full CRUD support with pagination and search
    - Prepared for JWT Auth (Step 2) and Next.js / React Frontend (Step 3)
    """,
    version="1.0.0",
)

# CORS Middleware (Cross-Origin Resource Sharing)
# Ready for Step 3 (React at localhost:3000 or Next.js / Vite at localhost:5173)
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

# Include v1 API Router
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
    """Health check endpoint for Docker / container orchestration."""
    return {"status": "healthy"}
