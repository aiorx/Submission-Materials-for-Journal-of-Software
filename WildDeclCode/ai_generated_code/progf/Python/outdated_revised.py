"""
Outdated - Revised

Improved Aided using common development resources
"""

months = {
    "january": 1, 
    "february": 2, 
    "march": 3,
    "april": 4, 
    "may": 5, 
    "june": 6,
    "july": 7, 
    "august": 8, 
    "september": 9,
    "october": 10, 
    "november": 11, 
    "december": 12
}


def parse_date_from_mdy(date):
    """ Attempt to parse date formatted as MM/DD/YYYY. """
    try:
        month, day, year = map(int, date.split('/'))
        if 1 <= month <= 12 and 1 <= day <= 31:
            return year, month, day
    except ValueError:
        pass
    return None


def parse_date_from_full_month(date):
    """ Attempt to parse date formatted as FullMonth DD, YYYY. """
    try:
        month, day, year = date.split()
        day = int(day.removesuffix(','))
        year = int(year)
        month = months[month.lower()]
        if 1 <= month <= 12 and 1 <= day <= 31:
            return year, month, day
    except (ValueError, KeyError):
        pass
    return None


def get_valid_date():
    """ Continuously prompt user until a valid date is entered. """
    while True:
        user_input = input("Date: ").strip()
        parsed_date = parse_date_from_mdy(user_input) or parse_date_from_full_month(user_input)
        if parsed_date:
            return parsed_date


if __name__ == "__main__":
    year, month, day = get_valid_date()
    print(f"{year}-{month:02d}-{day:02d}")
