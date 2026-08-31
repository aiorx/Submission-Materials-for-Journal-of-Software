```python
def ask(self):
    while (True):
        print(f"(T)rue or (F)alse: {self.text}")
        response = input("? ")

        if (len(response) == 0):
            print("Sorry, that's not a valid response. Please try again")
            continue

        response = response.lower()
        if (response[0] != "t" and response[0] != "f"):
            print("Sorry, that's not a valid response. Please try again")
            continue

        if response[0] == self.correct_answer:
            self.is_correct = True

        break
```