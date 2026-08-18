import logging
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.api.v1.router import api_router

# Ensure all ORM models are registered with Base metadata before table creation
import app.models  # noqa: F401

# Structured logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("vinyl_crate.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Handles startup schema initialization and graceful shutdown tasks.
    """
    # Startup: ensure tables exist
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
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

# Request logging and latency tracking middleware
@app.middleware("http")
async def log_requests_and_timing(request: Request, call_next):
    """
    HTTP middleware for request observability.
    Logs method, path, client IP, status code, and measures execution duration.
    Attaches `X-Process-Time` header to outgoing HTTP responses.
    """
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time_ms = (time.perf_counter() - start_time) * 1000

    response.headers["X-Process-Time"] = f"{process_time_ms:.2f}ms"

    client_ip = request.client.host if request.client else "unknown"
    logger.info(
        f'{client_ip} - "{request.method} {request.url.path}" '
        f"{response.status_code} ({process_time_ms:.2f}ms)"
    )

    return response


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
    expose_headers=["X-Process-Time"],
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
