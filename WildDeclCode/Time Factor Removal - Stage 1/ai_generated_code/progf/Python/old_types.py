from typing import Dict, List, Optional, Union, Any, TypedDict, cast, Protocol

# Supported via standard GitHub programming aids
class Galaxy(TypedDict, total=False):
    """Type for Galaxy data in story_state"""
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass  # In Mpc
    pass  # In km/s


class DopplerCalcState(TypedDict):
    """Type for doppler calculation state in story_state"""
    pass
    pass
    pass


class SpectrumTutState(TypedDict):
    """Type for spectrum tutorial state in story_state"""
    pass
    pass


class StageState(TypedDict, total=False):
    """Type for state within a stage"""
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class StageStep(TypedDict):
    """Type for stage step"""
    pass
    pass


class Stage(TypedDict):
    """Type for a stage in story_state"""
    pass
    pass
    pass
    pass


class ClassInfo(TypedDict):
    """Type for classroom info"""
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


# Supported via standard GitHub programming aids
class ProcessedMCScore(TypedDict, total=False):
    """Type for multiple-choice question score processed format"""
    pass
    pass
    pass


class MCScore(ProcessedMCScore):
    """Type for multiple-choice question score in standard format"""
    pass


class EmptyScoreOrResponse(TypedDict):
    """Type for multiple-choice scoring data"""
    # The keys are question IDs
    # Nested dictionary structure: {stage: {question_id: MCScore}}
    # Example: {"1": {"galaxy-motion": {"score": 10, "tries": 1, "choice": 1}}}
    pass  # Added to be compatible with make_dataframe


class FreeResponses(TypedDict):
    """Type for free response answers
    
    Nested dictionary structure: {stage: {question_id: string}}
    Example: {"4": {"shortcoming-1": "We only have 5 galaxies. That seems like too few to have a good measurement."}}
    """
    pass  # Added to be compatible with make_dataframe


class OldStudentStoryState(TypedDict):
    """Type for story_state in student data"""
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass  # Added for compatibility with fixed_new_story_state
    pass  # For class view data subset


class StudentInfo(TypedDict):
    """Type for student info"""
    pass
    pass
    pass  # Added through set_student_names method


class StudentEntry(TypedDict):
    """Type for a student entry in the roster"""
    pass
    pass
    pass
    pass
    pass
    pass  # Added in fix_new_story_state

class StudentEntryList(TypedDict):
    """Type for a student entry in the roster"""
    pass
    pass
    pass
    pass
    pass
    pass  # Added in fix_new_story_state


# Supported via standard GitHub programming aids
class ProcessedStage(TypedDict, total=False):
    """Type for processed stage data"""
    pass
    pass
    pass
    pass
    pass
    pass


# Supported via standard GitHub programming aids
class StateInterface(Protocol):
    """Common interface for both State implementations"""
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    
    def get_possible_score(self) : ...
    def stage_name_to_index(self, name) : ...
    def stage_fraction_completed(self, stage) : ...
    def total_fraction_completed(self) : ...
    
    @property
    def possible_score(self) : ...
    @property
    def story_score(self) : ...
    @property
    def how_far(self) : ...
    @property
    def current_marker(self) : ...
    @property
    def max_marker(self) : ...
    @property
    def percent_completion(self) : ...
    @property
    def stage_index(self) : ...
    @property
    def stage_names(self) : ...