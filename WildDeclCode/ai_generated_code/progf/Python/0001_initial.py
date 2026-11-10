# Auto-Aided using common development resources
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import Integer, String, Float, DateTime, func

# revision identifiers
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'players',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(100), nullable=False, unique=True),
        sa.Column('handicap_index', sa.Float, nullable=False)
    )
    op.create_table(
        'courses',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(100), nullable=False, unique=True),
        sa.Column('rating', sa.Float, nullable=False),
        sa.Column('slope', sa.Integer, nullable=False)
    )
    op.create_table(
        'holes',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('course_id', sa.Integer, sa.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False),
        sa.Column('hole_number', sa.Integer, nullable=False),
        sa.Column('par', sa.Integer, nullable=False),
        sa.Column('stroke_index', sa.Integer, nullable=False)
    )
    op.create_table(
        'competitions',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(100), nullable=False, unique=True)
    )
    op.create_table(
        'competition_days',
        sa.Column('competition_id', sa.Integer, sa.ForeignKey('competitions.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('day_number', sa.Integer, primary_key=True)
    )
    op.create_table(
        'scores',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('player_id', sa.Integer, sa.ForeignKey('players.id', ondelete='CASCADE'), nullable=False),
        sa.Column('hole_id', sa.Integer, sa.ForeignKey('holes.id', ondelete='CASCADE'), nullable=False),
        sa.Column('day_number', sa.Integer, nullable=False),
        sa.Column('strokes', sa.Integer, nullable=False),
        sa.Column('points', sa.Integer, nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    )

    # Seed courses
    courses = [
        {'id':1,'name':'Pasha','rating':67.7,'slope':123},
        {'id':2,'name':'Nobilis','rating':70.7,'slope':125},
        {'id':3,'name':'Sultan','rating':71.6,'slope':138},
        {'id':4,'name':'Lykia','rating':71.7,'slope':126},
    ]
    op.bulk_insert(table('courses',
        column('id', Integer), column('name', String),
        column('rating', Float), column('slope', Integer)
    ), courses)
    # [Hole seeding omitted]
    op.bulk_insert(table('competitions', column('id', Integer), column('name', String)), [{'id':1,'name':'Overall'}])
    for d in range(1,7):
        op.execute(f"INSERT INTO competition_days VALUES (1, {d})")

def downgrade():
    op.drop_table('scores')
    op.drop_table('competition_days')
    op.drop_table('competitions')
    op.drop_table('holes')
    op.drop_table('courses')
    op.drop_table('players')
