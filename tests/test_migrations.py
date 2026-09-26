import os
import sqlite3
import subprocess
import sys
from pathlib import Path

from alembic.config import Config
from alembic.script import ScriptDirectory

PROJECT_ROOT = Path(__file__).resolve().parents[1]


def test_app_startup_does_not_bypass_alembic(tmp_path: Path) -> None:
    database_path = tmp_path / "fresh.db"
    environment = {**os.environ, "DATABASE_URL": f"sqlite:///{database_path}"}

    def run(*arguments: str) -> None:
        completed = subprocess.run(
            [sys.executable, *arguments],
            cwd=PROJECT_ROOT,
            env=environment,
            capture_output=True,
            text=True,
        )
        assert completed.returncode == 0, completed.stderr

    run(
        "-c",
        "from fastapi.testclient import TestClient\n"
        "from app.main import app\n"
        "with TestClient(app) as client:\n"
        "    assert client.get('/health').status_code == 200\n",
    )
    run("-m", "alembic", "upgrade", "head")
    run("-m", "app.db.init_db")

    head = ScriptDirectory.from_config(Config(str(PROJECT_ROOT / "alembic.ini"))).get_current_head()
    with sqlite3.connect(database_path) as connection:
        assert connection.execute("SELECT version_num FROM alembic_version").fetchone()[0] == head
        assert connection.execute("SELECT COUNT(*) FROM users").fetchone()[0] == 1
        assert connection.execute("SELECT COUNT(*) FROM records").fetchone()[0] == 6
