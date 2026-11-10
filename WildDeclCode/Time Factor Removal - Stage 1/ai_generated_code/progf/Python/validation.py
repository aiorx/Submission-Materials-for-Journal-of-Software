"""
Validation module to check schema of CSV/Excel files.

First draft Built via standard programming aids.
"""

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from pathlib import Path

from frictionless import Checklist, Package, system
from frictionless.exception import FrictionlessException

from settings import VALIDATIONS_DIR, logger

system.trusted = True


def validate(filepath, process) :
    """Validate file using frictionless and schema defined in validations folder."""
    schema = VALIDATIONS_DIR / "{}.json".format(process)
    if not schema.exists():
        logger.warning("Validation file for process '{}' does not exist. Validation is skipped.".format(process))
        return False
    try:
        package = Package(schema)
    except FrictionlessException:
        logger.error("Error validating process '{}'.".format(process))
        raise

    for resource in package.resources:
        resource.path = str(filepath)
    checklist = Checklist(skip_errors=[])
    # Limit first validation to 20 rows to early break checks in case of an error:
    reports = {
        resource.name: resource.validate(checklist, parallel=True, limit_rows=20, limit_errors=10)
        for resource in package.resources
    }
    if not all(report.valid for report in reports.values()):
        logger.error("Error validating process '{}': {}".format(process, reports))
        return False
    reports = {resource.name: resource.validate(checklist, parallel=True, limit_errors=20) for resource in package.resources}
    if not all(report.valid for report in reports.values()):
        logger.error("Error validating process '{}': {}".format(process, reports))
        return False
    return True
