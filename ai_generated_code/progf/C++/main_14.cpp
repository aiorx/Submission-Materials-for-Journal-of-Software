// Class Management System 

// The Code After 110 line iS Supported via standard programming aids - I know the concept, but it was too much to write that much :D

// There are some faults but they are silly just ignore them.

#include <iostream>
#include <vector>

using namespace std;

class Student {
public:
    string name;
    string uid;
    string enrolledCourse;
    int section;
    char group;
};

class Teacher {
public:
    string name;
    string eid;
    string assignedSubject;
};

class Courses {
public:
    string name;
    vector<string> subjects;
    vector<Student> students;
    vector<Teacher> teachers;
};

int main() {
    vector<Courses> courseList;

    while (true) {
        int opt;
        cout << "1. Add a Course" << endl;
        cout << "2. View Courses" << endl;
        cout << "3. Manage Courses" << endl;
        cout << "4. Exit" << endl;
        cout << "Choose An Option From Above: ";
        cin >> opt;

        if (opt < 1 || opt > 4) {
            continue;
        }
        if (opt == 4) {
            return 0;
        } 
        else if (opt == 1) {
            Courses newCourse;
            cout << "Enter name of the Course: ";
            cin >> newCourse.name;

            int subjectNumber;
            cout << "Enter total number of subjects: ";
            cin >> subjectNumber;

            for (int i = 0; i < subjectNumber; i++) {
                string subject;
                cout << "Enter subject " << i + 1 << ": ";
                cin >> subject;
                newCourse.subjects.push_back(subject);
            }
            courseList.push_back(newCourse);
            cout << "Course Added Successfully." << endl;
        } 
        else if (opt == 2) {
            if (courseList.empty()) {
                cout << "No Course Available." << endl;
                continue;
            }
            cout << "Courses:\n";
            for (int i = 0; i < courseList.size(); i++) {
                cout << "Course Name: " << courseList[i].name << endl;
                cout << "Subjects:\n";
                for (int j = 0; j < courseList[i].subjects.size(); j++) {
                    cout << j + 1 << ". " << courseList[i].subjects[j] << endl;
                }
                cout << endl;
            }
        } 
        else if (opt == 3) {
            while (true) {
                if (courseList.empty()) {
                    cout << "No courses available.\n";
                    break;
                }
                cout << "Available Courses:\n";
                for (int i = 0; i < courseList.size(); i++) {
                    cout << i + 1 << ". " << courseList[i].name << endl;
                }
                cout << "Choose a Course (0 to go back): ";
                int opt2;
                cin >> opt2;

                if (opt2 == 0) break;
                if (opt2 < 1 || opt2 > courseList.size()) {
                    cout << "Invalid choice.\n";
                    continue;
                }

                int num = opt2 - 1;

                while (true) {
                    cout << "1. Add Student" << endl;
                    cout << "2. Add Teacher" << endl;
                    cout << "3. View Details" << endl;
                    cout << "4. Go Back" << endl;
                    cout << "Choose an option: ";
                    int opt3;
                    cin >> opt3;

                    if (opt3 == 4) break;
                    else if (opt3 == 1) {
                        Student newStudent;
                        cout << "Enter Student Name: ";
                        cin >> newStudent.name;
                        cout << "Enter Student UID: ";
                        cin >> newStudent.uid;
                        cout << "Enter Section Number: ";
                        cin >> newStudent.section;
                        cout << "Enter Group (A/B/C...): ";
                        cin >> newStudent.group;
                        newStudent.enrolledCourse = courseList[num].name;
                        courseList[num].students.push_back(newStudent);
                        cout << "Student Added Successfully!\n";
                    } 
                    else if (opt3 == 2) {
                        Teacher newTeacher;
                        cout << "Enter Teacher Name: ";
                        cin >> newTeacher.name;
                        cout << "Enter Employee ID: ";
                        cin >> newTeacher.eid; // Fixed: Now correctly prompts for Employee ID
                        cout << "Enter Assigned Subject: ";
                        cin >> newTeacher.assignedSubject; // Prompt for assigned subject
                        courseList[num].teachers.push_back(newTeacher);
                        cout << "Teacher Added Successfully!\n";
                    } 
                    else if (opt3 == 3) {
                        cout << "Course Name: " << courseList[num].name << endl;
                        cout << "Subjects:\n";
                        for (int j = 0; j < courseList[num].subjects.size(); j++) {
                            cout << j + 1 << ". " << courseList[num].subjects[j] << endl;
                        }
                        cout << "Students Enrolled:\n";
                        for (const auto& student : courseList[num].students) {
                            cout << "- " << student.name << " (UID: " << student.uid 
                                 << ", Section: " << student.section 
                                 << ", Group: " << student.group << ")" << endl;
                        }
                        cout << "Teachers Assigned:\n";
                        for (const auto& teacher : courseList[num].teachers) {
                            cout << "- " << teacher.name << " (EID: " << teacher.eid 
                                 << ", Subject: " << teacher.assignedSubject << ")" << endl;
                        }
                    } 
                    else {
                        cout << "Invalid option.\n";
                    }
                }
            }
        }
    }
}
