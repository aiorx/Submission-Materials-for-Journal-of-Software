"""
sqlalchemy_manual_utils.py

A utility module for performing common SQL operations using SQLAlchemy Core
(without Pandas) for creating tables, inserting rows, updating, deleting,
and fetching data manually in a MySQL database.

Author: Produced with third-party coding tools ChatGPT
"""

from sqlalchemy import (
    create_engine, MetaData, Table, Column, Integer, String, Float, DateTime,
    text, select, update, delete, inspect
)
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError


def get_engine(user: str, password: str, host: str, db: str, port: int = 3306) -> Engine:
    """
    Create a SQLAlchemy engine for MySQL using mysql-connector.
    """
    return create_engine(f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db}")


def create_table(engine: Engine, table_name: str, columns: list[Column], drop_if_exists: bool = True) -> bool:
    """
    Create a MySQL table manually using SQLAlchemy Core Column definitions.
    """
    metadata = MetaData()
    if drop_if_exists:
        drop_table(engine, table_name)

    try:
        table = Table(table_name, metadata, *columns)
        metadata.create_all(engine)
        print(f"✅ Created table `{table_name}`.")
        return True
    except SQLAlchemyError as e:
        print(f"❌ Failed to create table `{table_name}`: {e}")
        return False


def insert_row(engine: Engine, table_name: str, row_data: dict) -> bool:
    """
    Insert a single row into a MySQL table.
    """
    metadata = MetaData()
    metadata.reflect(bind=engine)
    table = metadata.tables[table_name]

    try:
        with engine.begin() as conn:
            conn.execute(table.insert().values(**row_data))
        print(f"➕ Inserted row into `{table_name}`.")
        return True
    except SQLAlchemyError as e:
        print(f"❌ Failed to insert row: {e}")
        return False


def insert_rows(engine: Engine, table_name: str, rows: list[dict]) -> int:
    """
    Insert multiple rows into a MySQL table.
    """
    metadata = MetaData()
    metadata.reflect(bind=engine)
    table = metadata.tables[table_name]

    try:
        with engine.begin() as conn:
            conn.execute(table.insert(), rows)
        print(f"➕ Inserted {len(rows)} row(s) into `{table_name}`.")
        return len(rows)
    except SQLAlchemyError as e:
        print(f"❌ Failed to insert rows: {e}")
        return 0


def update_row(engine: Engine, table_name: str, match_filter: dict, update_values: dict) -> int:
    """
    Update rows in a MySQL table based on a match filter.
    """
    metadata = MetaData()
    metadata.reflect(bind=engine)
    table = metadata.tables[table_name]

    with engine.begin() as conn:
        stmt = update(table).where(
            *[table.c[k] == v for k, v in match_filter.items()]
        ).values(**update_values)
        result = conn.execute(stmt)
        print(f"✏️ Updated {result.rowcount} row(s) in `{table_name}`.")
        return result.rowcount


def delete_rows(engine: Engine, table_name: str, condition: dict) -> int:
    """
    Delete rows from a MySQL table based on a condition.
    """
    metadata = MetaData()
    metadata.reflect(bind=engine)
    table = metadata.tables[table_name]

    with engine.begin() as conn:
        stmt = delete(table).where(
            *[table.c[k] == v for k, v in condition.items()]
        )
        result = conn.execute(stmt)
        print(f"➖ Deleted {result.rowcount} row(s) from `{table_name}`.")
        return result.rowcount


def fetch_rows(engine: Engine, table_name: str, limit: int = None) -> list[dict]:
    """
    Fetch all rows from a table, optionally with a limit.
    """
    metadata = MetaData()
    metadata.reflect(bind=engine)
    table = metadata.tables[table_name]

    stmt = select(table)
    if limit:
        stmt = stmt.limit(limit)

    with engine.connect() as conn:
        result = conn.execute(stmt)
        rows = [dict(row._mapping) for row in result]
        print(f"🔍 Retrieved {len(rows)} row(s) from `{table_name}`.")
        return rows


def drop_table(engine: Engine, table_name: str) -> bool:
    """
    Drop a table if it exists in the database.
    """
    try:
        with engine.begin() as conn:
            conn.execute(text(f"DROP TABLE IF EXISTS {table_name}"))
        print(f"🧽 Dropped table `{table_name}`.")
        return True
    except SQLAlchemyError as e:
        print(f"❌ Failed to drop table `{table_name}`: {e}")
        return False


def table_exists(engine: Engine, table_name: str) -> bool:
    """
    Check if a table exists in the connected MySQL database.
    """
    inspector = inspect(engine)
    return table_name in inspector.get_table_names()
