# 🎵 Vinyl Crate — Full-Stack Audiophile Inventory

A production-ready full-stack application for cataloging, grading, valuing, and browsing vinyl record collections with interactive 3D crate flipping.

Built with **FastAPI**, **SQLAlchemy 2.0**, **Alembic**, **PostgreSQL / SQLite**, **Pydantic v2**, **Mypy**, **React 18**, **TypeScript**, **TailwindCSS**, and **Ruff**.

---

## 🌟 Architecture & Key Features

- **Backend (FastAPI & SQLAlchemy 2.0)**:
  - Enterprise modular architecture (`core/`, `models/`, `schemas/`, `crud/`, `api/v1/`).
  - Salted **bcrypt** password hashing and stateless **JWT authentication**.
  - Multi-tenant crate isolation: each collector has a private, isolated collection.
  - Schema migrations version control with **Alembic**.
  - High-precision request latency tracking with `X-Process-Time` middleware.
  - Interactive OpenAPI / Swagger UI at `/docs`.

- **Frontend (React 18, TypeScript & TailwindCSS)**:
  - **3D Crate Digging View**: Tactile sleeve browsing with gesture drag, mouse-wheel, arrow keys, and spinning vinyl disc animations.
  - **Grid Gallery View**: Responsive album sleeve grid with condition tags and quick actions.
  - **Crate Analytics**: Live total value, disc count, and pressing era span.
  - **AuthContext**: Persistent authentication state in `localStorage` with automatic Bearer token attachment.

- **DevOps, Security & Testing**:
  - Unified configuration with modern **`pyproject.toml`** (PEP 621).
  - Ultra-fast linting and code formatting powered by **Ruff**.
  - Strict compile-time type safety with **Mypy**.
  - Automated **GitHub Actions CI** pipeline for:
    - 🔑 **Gitleaks**: Automated secret scanning to prevent credential leaks.
    - 📦 **pip-audit**: Dependency vulnerability auditing against PyPA/OSV databases.
    - 🏷️ **Mypy**: Backend static type verification.
    - 🧪 **Pytest**: 18 automated tests with **96% code coverage**.
    - ⚛️ **Frontend Build**: TypeScript typecheck and production build.
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

# ✨ 5. Lint, format, and typecheck code
make format
make typecheck

# 🔒 6. Run dependency vulnerability audit
make audit

# 🗄️ 7. Run database migrations
make migrate

# 🐳 8. Run full stack in Docker Compose
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

## 🧪 Testing, Quality & Security Checks

```bash
# 1. Run full Pytest test suite
pytest -v

# 2. Run with test coverage report
pytest --cov=app --cov-report=term-missing tests/

# 3. Check and auto-format with Ruff
ruff check --fix app/ tests/
ruff format app/ tests/

# 4. Run static type checker
mypy app/

# 5. Run dependency vulnerability audit
pip-audit
```

---

## 🔑 Demo Credentials

- **Username**: `vinyl_fan`
- **Email**: `collector@crate.com`
- **Password**: `secretpassword123`

*(You can also use the one-click **"Click for Instant Demo Login"** button directly in the UI)*.
