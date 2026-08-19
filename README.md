# 🎵 Vinyl Crate — Full-Stack Audiophile Inventory

A production-ready full-stack application for cataloging, grading, valuing, and browsing vinyl record collections with interactive 3D crate flipping.

Built with **FastAPI**, **SQLAlchemy 2.0**, **Alembic**, **PostgreSQL / SQLite**, **Pydantic v2**, **React**, **TypeScript**, **TailwindCSS**, and **Ruff**.

---

## 🌟 Architecture & Key Features

- **Backend (FastAPI & SQLAlchemy 2.0)**:
  - Enterprise modular architecture (`core/`, `models/`, `schemas/`, `crud/`, `api/v1/`).
  - Salted **bcrypt** password hashing and stateless **JWT authentication**.
  - Multi-tenant crate isolation: each collector has a private, isolated collection.
  - Schema migrations version control with **Alembic**.
  - High-precision request latency tracking with `X-Process-Time` middleware.
  - Interactive OpenAPI / Swagger UI at `/docs`.

- **Frontend (React, TypeScript & TailwindCSS)**:
  - **3D Crate Digging View**: Tactile sleeve browsing with gesture drag, mouse-wheel, arrow keys, and spinning vinyl disc animations.
  - **Grid Gallery View**: Responsive album sleeve grid with condition tags and quick actions.
  - **Crate Analytics**: Live total value, disc count, and pressing era span.
  - **AuthContext**: Persistent authentication state in `localStorage` with automatic Bearer token attachment.

- **DevOps, Quality & Testing**:
  - Unified configuration with modern **`pyproject.toml`** (PEP 621).
  - Ultra-fast linting and code formatting powered by **Ruff**.
  - Comprehensive Pytest test suite with **96% code coverage** and isolated in-memory test database fixtures.
  - Automated **GitHub Actions CI** pipeline for linting, testing, and frontend builds.
  - Production-grade `Dockerfile` with non-root security and layer caching.
  - `docker-compose.yml` for 1-command full-stack orchestration (**FastAPI + PostgreSQL 16 + React**).

---

## ⚡ Quick Start with `make`

The repository includes a self-documenting [`Makefile`](./Makefile) that automates common developer tasks:

```bash
# 🛠️ 1. Setup & install backend + frontend
make install

# 🚀 2. Run backend (FastAPI with hot-reload)
make dev

# 🎨 3. Run frontend (React + Vite)
make frontend

# 🧪 4. Run test suite & coverage
make test
make coverage

# ✨ 5. Lint and format code with Ruff
make format

# 🗄️ 6. Run database migrations
make migrate

# 🐳 7. Run full stack in Docker Compose
make docker-up
```

---

## 🚀 Getting Started (Manual Commands)

### Option A: 1-Command Launch with Docker Compose

```bash
# Spin up PostgreSQL, FastAPI backend, and React frontend
docker compose up --build
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option B: Local Development

#### 1. Backend (FastAPI):
```bash
# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies (runtime + dev tools)
pip install -e ".[dev]"

# Start backend server
uvicorn main:app --reload
```

#### 2. Frontend (React + Vite):
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing & Code Quality

```bash
# Run full Pytest test suite
pytest -v

# Run with test coverage report
pytest --cov=app --cov-report=term-missing tests/

# Check and auto-format with Ruff
ruff check --fix app/ tests/
ruff format app/ tests/
```

---

## 🔑 Demo Credentials

- **Username**: `vinyl_fan`
- **Email**: `collector@crate.com`
- **Password**: `secretpassword123`

*(You can also use the one-click **"Click for Instant Demo Login"** button directly in the UI)*.
