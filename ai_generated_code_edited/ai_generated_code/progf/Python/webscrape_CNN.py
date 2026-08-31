from bs4 import BeautifulSoup
import requests
from datetime import datetime, timedelta

#thanks chatgpt
def get_past_sundays(n):
    """
    Generates dates for the past 'n' Sundays from the last Sunday.
    
    Args:
    - n (int): Number of Sundays to generate.
    
    Returns:
    - List of strings representing the dates of past Sundays in the format "month-day-year".
    """
    # Current date
    now = datetime.now()
    
    # Find last Sunday
    last_sunday = now - timedelta(days=(now.weekday() + 1) % 7)
    
    # Generate a list of past Sundays
    sundays = [(last_sunday - timedelta(weeks=i)).strftime("%Y-%m-%d").lower() for i in range(n)]
    
    # Format the dates correctly (month in lowercase, hyphens for separation)
    formatted_sundays = [date.replace(" ", "-") for date in sundays]
    
    return formatted_sundays

def save_article(response, date):
    with open("../transcripts_CNN/" + date + ".txt", 'w') as file:
            
        soup = BeautifulSoup(response.text, 'html.parser')

        # specific_content = soup.select_one('html body div:nth-of-type(2) div:nth-of-type(1) div div div:nth-of-type(1) div:nth-of-type(2) table tbody tr:nth-of-type(2) td div p:nth-of-type(6)').text
        elements_with_class = soup.find_all('p', class_='cnnBodyText')

        # Print each element found
        print(elements_with_class[2].text)
        #file.write(specific_content)
    print(date)


# Get the list of Sundays
past_sundays = get_past_sundays(2000)

# Print the dates
for date in past_sundays:
    print(date) # 2022-05-08 is format

    url = 'https://transcripts.cnn.com/show/ip/date/' + date + '/segment/01'
    response = requests.get('https://transcripts.cnn.com/show/cnnt/date/2022-06-30/segment/02')
    #response = requests.get(url)


    print("status code: " + str(response.status_code))

    if response.status_code == 200:
        #print(response.text)
        save_article(response, date)
    
        
