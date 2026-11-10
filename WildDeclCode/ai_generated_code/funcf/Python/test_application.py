```python
def generate_cpf(self):
    # Generate the first 9 random digits
    cpf = [random.randint(0, 9) for _ in range(9)]

    # Calculate the first verification digit
    sum_first = sum((cpf[i] * (10 - i) for i in range(9)))
    first_verification_digit = (sum_first * 10 % 11) % 10
    cpf.append(first_verification_digit)

    # Calculate the second verification digit
    sum_second = sum((cpf[i] * (11 - i) for i in range(10)))
    second_verification_digit = (sum_second * 10 % 11) % 10
    cpf.append(second_verification_digit)

    # Convert list of digits into a formatted string
    cpf_str = "".join(map(str, cpf))
    formatted_cpf = f"{cpf_str[:3]}.{cpf_str[3:6]}.{cpf_str[6:9]}-{cpf_str[9:]}"

    return formatted_cpf
```