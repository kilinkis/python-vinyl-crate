# 🎵 Vinyl Crate — Full-Stack Audiophile Inventory

A production-ready full-stack application for cataloging, grading, valuing, and browsing vinyl record collections with interactive 3D crate flipping.

Built with **FastAPI**, **SQLAlchemy 2.0**, **PostgreSQL / SQLite**, **Pydantic v2**, **React 18**, **TypeScript**, and **TailwindCSS**.

---

## 🌟 Architecture & Key Features

- **Backend (FastAPI & SQLAlchemy 2.0)**:
  - Enterprise modular structure (`core/`, `models/`, `schemas/`, `crud/`, `api/v1/`).
  - Salted **bcrypt** password hashing and stateless **JWT authentication**.
  - Multi-tenant crate isolation: each collector has an isolated, private archive.
  - Full CRUD operations with search, pagination, and sorting.
  - Interactive OpenAPI / Swagger UI at `/docs`.

- **Frontend (React 18, TypeScript & TailwindCSS)**:
  - **3D Crate Digging View**: Tactile sleeve browsing with gesture drag, mouse-wheel, arrow keys, and spinning vinyl disc animations.
  - **Grid Gallery View**: Responsive album sleeve grid with condition tags and quick actions.
  - **Crate Analytics**: Live total value, disc count, and pressing era span.
  - **AuthContext**: Persistent authentication state in `localStorage` with automatic Bearer token attachment.

- **DevOps & Testing (Pytest & Docker)**:
  - Comprehensive Pytest test suite with **96% code coverage** and isolated in-memory test database fixtures.
  - Production-grade `Dockerfile` with non-root security and layer caching.
  - `docker-compose.yml` for 1-command full-stack orchestration (**FastAPI + PostgreSQL 16 + React**).

---

## 🚀 Getting Started

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

## 🧪 Running the Pytest Test Suite

Execute the automated test suite with coverage report:

```bash
# Run all tests
pytest -v

# Run tests with coverage report
pytest --cov=app tests/
```

---

## 🔑 Demo Credentials

- **Username**: `vinyl_fan`
- **Email**: `collector@crate.com`
- **Password**: `secretpassword123`

*(You can also use the one-click **"Click for Instant Demo Login"** button directly in the UI)*.
