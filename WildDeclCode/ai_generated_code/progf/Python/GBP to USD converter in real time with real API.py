# This is the original example of the teacher:
# import requests
#
# amount = int(input('Enter an amount of pounds: '))
#
# response = requests.get('https://api.exchangerate-api.com/v4/latest/GBP')
# exchange_rate = response.json()['rates']
# usd_rate = exchange_rate['USD']
# usd_amount = amount * usd_rate
#
# us_dollars = usd_amount
#
# print(f'{amount:.2f} GBP is equivalent to {us_dollars:.2f} USD')


# This is second example of the teacher:
import requests

choice = input('Choice currency: \n1. USD \n2. GBP \n3.JPY \nPlease,select your choice: ')

if choice == '1':
    amount = int(input('Please input your amount: '))
    response = requests.get('https://api.exchangerate-api.com/v4/latest/USD')
    exchange_rate = response.json()['rates']
    usd_rate = exchange_rate['USD']
    usd_amount = amount * usd_rate
    us_dollars = usd_amount

elif choice == '2':
    amount = int(input('Please input your amount: '))
    response = requests.get('https://api.exchangerate-api.com/v4/latest/GBP')
    exchange_rate = response.json()['rates']
    usd_rate = exchange_rate['USD']
    usd_amount = amount * usd_rate
    us_dollars = usd_amount

elif choice == '3':
    amount = int(input('Please input your amount: '))
    response = requests.get('https://api.exchangerate-api.com/v4/latest/JPY')
    exchange_rate = response.json()['rates']
    usd_rate = exchange_rate['USD']
    usd_amount = amount * usd_rate
    us_dollars = usd_amount

print(f'{amount:.3f} GBP is equivalent to {us_dollars:.3f} USD')


# This code is Assisted with basic coding tools,is it with dictionaries. The differences are obvious,he use a lot of comments and
# the code is wriiten to be more changeble in the future,because of the dictionaries structure.

import requests

# URL of the API
url = 'https://api.exchangerate-api.com/v4/latest/GBP'

# Send the request to the API and get the response in JSON format
response = requests.get(url)
exchange_rate = response.json()['rates']

# Define available currency types in a dictionary
currencies = {
    '1': 'USD',  # US Dollar
    '2': 'EUR',  # Euro
    '3': 'JPY'   # Japanese Yen
}

# Display available currency choices
print("Choose a currency to convert GBP to:")
for key, currency in currencies.items():
    print(f"{key}. {currency}")

# Get the user's choice
choice = input("Enter the number of your choice: ")

# Check if the choice is valid
if choice in currencies:
    amount = float(input("Enter an amount of GBP: "))
    selected_currency = currencies[choice]
    # Get the exchange rate for the selected currency
    rate = exchange_rate[selected_currency]
    converted_amount = amount * rate
    print(f"{amount:.2f} GBP is equivalent to {converted_amount:.2f} {selected_currency}")
else:
    print("Invalid choice. Please select a valid currency.")



# Optimized code without dictionary and list, only based knowledge. Here is used function and while loop.
import requests


# Function to fetch the exchange rate and convert to USD
def convert_currency(amount, currency_code):
    response = requests.get(f'https://api.exchangerate-api.com/v4/latest/{currency_code}')
    exchange_rate = response.json()['rates']
    usd_rate = exchange_rate['USD']
    return amount * usd_rate


# Loop to handle invalid choices and keep prompting the user
while True:
    choice = input('Choice currency: \n1. USD \n2. GBP \n3. JPY \nPlease, select your choice: ')

    if choice == '1':
        currency_code = 'USD'
        break
    elif choice == '2':
        currency_code = 'GBP'
        break
    elif choice == '3':
        currency_code = 'JPY'
        break
    else:
        print("Invalid choice. Please select again.")

amount = float(input('Please input your amount: '))
usd_amount = convert_currency(amount, currency_code)

print(f'{amount:.3f} {currency_code} is equivalent to {usd_amount:.3f} USD')
