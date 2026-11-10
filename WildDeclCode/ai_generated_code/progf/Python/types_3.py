"""
Type definitions for CosmicDS Educator Dashboard
Aided with basic GitHub coding tools
"""

from typing import Dict, List, Optional, Union, Any, TypedDict, Literal, Protocol


class SpeechSettings(TypedDict):
    rate: float
    pitch: float
    voice: Optional[str]
    autoread: bool


class ClassInfo(TypedDict):
    id: int
    code: str
    name: str
    test: bool
    active: bool
    created: str
    updated: Optional[str]
    educator_id: int
    small_class: bool
    asynchronous: bool
    expected_size: int


class Classroom(TypedDict):
    size: int
    class_info: ClassInfo


class AppState(TypedDict):
    speech: SpeechSettings
    student: Dict[str, int]
    classroom: Classroom
    update_db: bool


class MCQuestionScore(TypedDict):
    tag: str
    score: Optional[int]
    stage: str
    tries: int
    choice: Optional[int]
    wrong_attempts: int


class FreeResponseItem(TypedDict):
    tag: str
    stage: str
    response: str
    initialized: bool


class StoryState(TypedDict):
    title: str
    story_id: str
    last_route: str
    mc_scoring: Dict[str, Dict[str, MCQuestionScore]]
    calculations: Dict[str, Any]
    best_fit_slope: Optional[float]
    free_responses: Dict[str, Dict[str, FreeResponseItem]]
    max_route_index: int
    class_data_students: List[Any]
    has_best_fit_galaxy: bool


class StudentInfo(TypedDict):
    username: str
    email: str
    name: Optional[str]


class NewStudentStoryState(TypedDict):
    """Type for story_state in new database format with app and story keys"""
    app: AppState
    story: StoryState
    free_responses: Dict[str, Dict[str, FreeResponseItem]]
    mc_scoring: Dict[str, Dict[str, MCQuestionScore]]


class StudentEntry(TypedDict):
    student_id: int
    story_name: str
    story_state: NewStudentStoryState
    last_modified: str
    student: StudentInfo
    app_state: Optional[Dict[str, Any]]  # Added for compatibility with fix_new_story_state


class NewRosterEntry(StudentEntry):
    """Student entry for new database (class_id >= 215)"""
    pass


class NewRoster(TypedDict):
    """Type for new roster data structure (class_id >= 215)"""
    students: List[NewRosterEntry]


# Transformed roster structure (after processing by Roster class)
class ProcessedMCScore(TypedDict):
    tries: int
    choice: Optional[int]
    score: Optional[int]


class ProcessedStage(TypedDict):
    marker: Optional[str]
    state: Dict[str, Any]
    index: int
    progress: Optional[float]
    current_step: Optional[str]
    max_step: Optional[str]


class ProcessedFreeResponse(TypedDict):
    """Free response answers organized by stage and question"""
    stage_name: Dict[str, str]  # question_key: response


class ProcessedState(TypedDict):
    """Student state after processing"""
    stages: Dict[str, ProcessedStage]
    mc_scoring: Dict[str, Dict[str, ProcessedMCScore]]
    responses: Dict[str, Dict[str, str]]
    student_id: int
    max_stage_index: int
    max_marker: str
    stage_index: int
    total_score: int


# Aided with basic GitHub coding tools
class StateInterface(Protocol):
    """Common interface for both State implementations"""
    story_state: Any
    stages: Dict[str, Any]
    responses: Dict[str, Any]
    mc_scoring: Dict[str, Dict[str, ProcessedMCScore]]
    max_stage_index: int
    has_best_fit_galaxy: bool
    stage_map: Dict[int, str]
    stage_names: List[str]  # Added missing attribute causing error
    
    def get_possible_score(self) -> int: ...
    def stage_name_to_index(self, name: str) -> Optional[int]: ...
    def stage_fraction_completed(self, stage) -> Union[float, None]: ...
    def total_fraction_completed(self) -> Dict[str, Union[float, int]]: ...
    
    @property
    def possible_score(self) -> int: ...
    @property
    def story_score(self) -> int: ...
    @property
    def how_far(self) -> Dict[str, Union[str, float]]: ...
    @property
    def current_marker(self) -> Union[str, float]: ...
    @property
    def max_marker(self) -> Union[str, float, int]: ...
    @property
    def percent_completion(self) -> float: ...
    @property
    def stage_index(self) -> int: ...