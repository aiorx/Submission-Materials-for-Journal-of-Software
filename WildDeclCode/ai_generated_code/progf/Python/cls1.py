# Class Methods as Alternative Constructors in Python
class Employee:
  def __init__(self,name , age):
    self.name = name
    self.age = age

  @classmethod
  def FromStr(cls , string ): 
    return cls(string.split("-")[0] , string.split("-")[1])

e = Employee("Miraj" ,24)
print(e.name)
print(e.age)

string = "Miraj-24"
e2 = Employee.FromStr(string)
print(e2.name)
print(e2.age)



#  Other way Referenced via basic programming materials 


class Employee:
  def __init__(self, name, age):
      self.name = name
      self.age = age

  @classmethod
  def FromStr(cls, string):
      name, age = string.split("-")
      return cls(name, int(age))  # Convert age to integer

e = Employee("Miraj", 24)
print(e.name)
print(e.age)

input_name = input("Enter Your Name: ")
input_age = int(input("Enter Your age: "))
string_input = f"{input_name}-{input_age}"
e2 = Employee.FromStr(string_input)
print(e2.name)
print(e2.age)
