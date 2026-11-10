# test_school.py was Crafted with standard coding tools, see comments in source/school.py

# Run this as follows:
# .../tests$ pytest test_school.py
# .../tests$ pytest -v test_school.py

import pytest
from source.school import TooManyStudents, Classroom, Teacher, Student

# Fixtures
@pytest.fixture
def professor_mcgonagall():
    """Fixture for the teacher of the Transfiguration class."""
    return Teacher("Minerva McGonagall")

@pytest.fixture
def transfiguration_students():
    """Fixture for initial students in the Transfiguration class."""
    return [Student("Harry Potter"), Student("Hermione Granger"), Student("Ron Weasley")]

@pytest.fixture
def transfiguration_class(professor_mcgonagall, transfiguration_students):
    """Fixture for the Transfiguration classroom setup."""
    return Classroom(professor_mcgonagall, transfiguration_students, "Transfiguration")

# Parameterized Test for Adding Students
@pytest.mark.parametrize(
    "student_name",
    ["Luna Lovegood", "Neville Longbottom", "Ginny Weasley"]
)
def test_add_student(transfiguration_class, student_name):
    """Test adding students to the Transfiguration class."""
    new_student = Student(student_name)
    transfiguration_class.add_student(new_student)
    assert any(student.name == student_name for student in transfiguration_class.students)

# Test Adding Too Many Students
def test_add_too_many_students(transfiguration_class):
    """Test adding more students than allowed raises TooManyStudents."""
    # Add students to reach capacity
    for i in range(8):  # Classroom already has 3 students, adding 8 makes it 11
        transfiguration_class.add_student(Student(f"Student {i}"))
    # Adding the 11th student should raise an exception
    with pytest.raises(TooManyStudents):
        transfiguration_class.add_student(Student("Draco Malfoy"))

# Test Removing a Student
def test_remove_student(transfiguration_class):
    """Test removing an existing student."""
    transfiguration_class.remove_student("Harry Potter")
    assert not any(student.name == "Harry Potter" for student in transfiguration_class.students)

# Test Removing a Non-Existent Student
def test_remove_non_existent_student(transfiguration_class):
    """Test removing a student who is not in the class."""
    initial_count = len(transfiguration_class.students)
    transfiguration_class.remove_student("Draco Malfoy")
    assert len(transfiguration_class.students) == initial_count

# Parameterized Test for Changing the Teacher
@pytest.mark.parametrize(
    "new_teacher_name",
    ["Severus Snape", "Albus Dumbledore"]
)
def test_change_teacher(transfiguration_class, new_teacher_name):
    """Test changing the teacher of the Transfiguration class."""
    new_teacher = Teacher(new_teacher_name)
    transfiguration_class.change_teacher(new_teacher)
    assert transfiguration_class.teacher.name == new_teacher_name

# Test Classroom Initialization
def test_classroom_initialization(transfiguration_class):
    """Test the initial setup of the Transfiguration classroom."""
    assert transfiguration_class.teacher.name == "Minerva McGonagall"
    assert len(transfiguration_class.students) == 3
    assert transfiguration_class.course_title == "Transfiguration"
