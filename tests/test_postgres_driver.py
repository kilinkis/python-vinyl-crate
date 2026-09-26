from sqlalchemy import create_engine


def test_compose_postgres_driver_can_load() -> None:
    engine = create_engine("postgresql+psycopg2://user:password@localhost/vinyl_crate")
    assert engine.dialect.driver == "psycopg2"
    engine.dispose()
