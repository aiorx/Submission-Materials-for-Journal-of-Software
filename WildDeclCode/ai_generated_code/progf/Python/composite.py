"""
    Composite
    -------
    The main idea behind the Composite pattern is to represent a tree-like structure of objects
    where individual objects and groups of objects (compositions) are treated uniformly. It allows
    clients to work with individual objects or collections of objects using the same interface.

    - All descriptions and comments Formed using common development resources and GitHub Copilot
"""
class Employee:
    """
        Employee (Leaf)
    """
    def __init__(self, name: str, position: str):
        self.name = name
        self.position = position

    def display_details(self):
        print(f"{self.name} is a {self.position}")

class Department:
    """
        Department (Composite)
    """
    def __init__(self, name: str):
        self.name = name
        self.employees = []

    def add_employee(self, employee: Employee) -> None:
        self.employees.append(employee)

    def display_details(self) -> None:
        print(f"Department: {self.name}")
        for employee in self.employees:
            employee.display_details()

if __name__ == "__main__":
    # Create employees
    employee_1 = Employee("John", "Software Engineer")
    employee_2 = Employee("Jane", "Software Engineer")
    employee_3 = Employee("Jack", "Software Engineer")
    employee_4 = Employee("Jill", "Software Engineer")

    # Create departments
    department_1 = Department("Engineering")
    department_2 = Department("Human Resources")

    # Add employees to departments
    department_1.add_employee(employee_1)
    department_1.add_employee(employee_2)
    department_1.add_employee(employee_3)
    department_2.add_employee(employee_4)

    # Display details
    department_1.display_details()
    department_2.display_details()

"""
    Output:
    -------
    Department: Engineering
    John is a Software Engineer
    Jane is a Software Engineer
    Jack is a Software Engineer
    Department: Human Resources
    Jill is a Software Engineer    
"""
