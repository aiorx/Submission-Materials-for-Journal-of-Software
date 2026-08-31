"""
Type definitions for CosmicDS Educator Dashboard - imports from old and new types
Supported via standard GitHub programming aids
"""

from typing import Dict, List, Optional, Union, Any, Protocol, TypeVar, TypedDict

# Import types from old_types (database) and new_types (database_new)
from .old_types import (
    # Basic old types
    Galaxy,
    StageState,
    Stage,
    ClassInfo,
    ProcessedMCScore,
    MCScore,
    EmptyScoreOrResponse,
    FreeResponses,
    OldStudentStoryState,
    StudentInfo,
    StudentEntry,
    ProcessedStage,
    StudentEntryList,
)

# Import shared interface
from .old_types import StateInterface

# Import old roster types
from .old_types import StudentEntry as OldRosterEntry

# Import types needed for the class_report.py file
from ..database_new.types import (
    StudentEntry as NewRosterEntry,
    NewRoster,
    ProcessedState,
)

# Define an OldRoster class to match the NewRoster class for consistency
class OldRoster(TypedDict):
    """Type for old roster data structure (class_id < 215)"""
    students: List[OldRosterEntry]

# Common attributes for both old and new Roster classes
class RosterAttributes(TypedDict, total=False):
    """Common attributes of Roster class regardless of database version"""
    class_id: Optional[int]
    roster: List[Union[OldRosterEntry, NewRosterEntry]]
    new_db: bool
    student_id: Dict[str, Any]
    story_name: Dict[str, Any]
    story_state: Dict[str, Any]
    last_modified: Dict[str, Any]
    data: Any
    student_data: Dict[int, Any]
    class_summary: Any
    max_stage_index: int
    max_marker: Any
    has_real_names: bool
    real_names: Optional[Dict[int, str]]