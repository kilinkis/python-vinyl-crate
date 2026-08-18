# 🎵 Vinyl Crate — Full-Stack Audiophile Inventory

A production-ready full-stack web application for cataloging, grading, and valuing vinyl record collections.

Built with **FastAPI**, **SQLAlchemy 2.0**, **PostgreSQL / SQLite**, **Pydantic v2**, **React 18**, **TypeScript**, and **TailwindCSS**.

---

## 🌟 Architecture Overview

- **Backend**:
  - FastAPI with asynchronous route handlers and dependency injection.
  - SQLAlchemy 2.0 ORM with typed `Mapped[...]` columns.
  - User authentication via salted **bcrypt** password hashing and stateless **JWT tokens**.
  - Multi-tenant crate isolation: each collector manages their own private collection.
  - Full CRUD operations with search, pagination, and sorting.
  - Interactive OpenAPI / Swagger UI at `/docs`.

- **Frontend**:
  - React 18 + Vite + TypeScript.
  - TailwindCSS with custom vinyl disc groove textures and sliding disc animations.
  - Real-time search, condition grading filters, and portfolio value analytics.
  - Live album artwork preview and sample presets.
  - `AuthContext` with automatic JWT Bearer token injection and persistence.

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
# 1. Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start FastAPI server
uvicorn main:app --reload
```
API runs at **`http://127.0.0.1:8000`** (Swagger docs at **`http://127.0.0.1:8000/docs`**).

---

### 2. Frontend Setup

In a second terminal window:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start Vite development server
npm run dev
```
Frontend runs at **`http://localhost:5173`**.

---

## 🧪 Demo Credentials

- **Username**: `vinyl_fan`
- **Email**: `collector@crate.com`
- **Password**: `secretpassword123`

*(You can also use the one-click "Instant Demo Login" button directly in the UI modal)*.
