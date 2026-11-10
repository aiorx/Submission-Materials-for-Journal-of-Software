# Assisted using common GitHub development utilities on 2025-08-15
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0001_initial"),
    ]

    # No-op: campo created_at già presente in 0001_initial. Migrazione mantenuta per coerenza timeline.
    operations = []
