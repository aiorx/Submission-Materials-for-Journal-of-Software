import re


def extract_emails(text: str):
    """Extracts email addresses from the given text string.
    This pattern matches:
    - Local part: alphanumeric characters, dots, underscores, and hyphens
    - @ symbol
    - Domain part: alphanumeric characters, dots, and hyphens
    - Top-level domain: 2 or more alphabetic characters(e.g, .co, .com, .org, etc.)

    Args:
        text (str): text string to extract emails from
    """
    return re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)


def extract_urls(text: str):
    """Extracts URLs from the given text string.
    This pattern matches:
    - http:// or https://
    - www.
    - Domain name

    Args:
        text (str): text string to extract URLs from
    """
    return re.findall(r"www.[^\s<>\"]+|https?:\/\/[^\s<>\"]+", text)


def extract_html_tags(text: str):
    """Extracts HTML tags from the given text string.
    This pattern matches:
    - Opening and closing tags ("<")
    - Tags with attributes (e.g "div class='container'")
    - Self-closing tags (">")
    Args:
        text (str): text string to extract HTML tags from
    """
    return re.findall(r"<[^>]+>", text)


def extract_hash_tags(text: str):
    """Extracts hashtags from the given text string.
    This pattern matches:
    - Hash symbol (#)
    - Alphanumeric characters following the hash symbol
    Args:
        text (str): text string to extract hashtags from
    """
    return re.findall(r"#\w+", text)


def extract_currency(text: str):
    """Extracts currency values from the given text string.
    This pattern matches:
    - Dollar sign ($)
    - Digits with optional commas
    - Opitional decimal points
    - Optional decimal digits

    Args:
        text (str): text string to extract currency values from
    """
    return re.findall(r"\$\d{1,3}(?:,\d{3})*(?:\.\d+)?", text)


def pretty_print(items: list, title: str):
    """ "Prints a list of items with a title."""
    print(f"============\n{title}\n============")
    for item in items:
        print(f"- {item}")
    print("============\n")


# This text string is Aided using common development resources
SAMPLE_TEXT = """Welcome to the event! For more info, contact us at info@openai.com or reach out to john.doe@company.co.uk.  
Visit our official website: https://www.openai.com and our blog at https://blog.openai.com/post?id=123.

Customer service numbers: (123) 456-7890, 123-456-7890, and 987.654.3210.  
Need help? Call 800-123-4567. Support is available from 9:00 AM to 6:00 PM, and again at 14:00 daily.

We accept Visa and Mastercard: 1234 5678 9012 3456 or 4321-8765-2109-6543.  
All transactions are in USD: $19.99, $1,234.56, and sometimes even $0.99 for special deals.

<p>This is a paragraph.</p>
<div class="container">
  <img src="banner.jpg" alt="Sale Banner">
</div>

Follow us on social media with hashtags like #OpenAI, #ArtificialIntelligence, and #ThisIsAHashtag.  
Make sure to tag your posts!

Broken tags sometimes appear like <div><p>Oops</div>.

Also check out our partners: https://partner1.example.org/page?id=456 and http://partner2.net.

Subscribe to our newsletter sent every Friday at 10:30 AM or 22:00 depending on your region.

Additional emails for departments: finance@biz.org, support@service.net, first.last@uni.edu.  

Join the discussion at https://forum.techcommunity.org/topic?id=ai-tools.

Random notes:
- Incorrect email: user@@example..com
- Not a real hashtag: #!
- Credit card typo: 1234-567-8901-23456

Thank you!
"""


pretty_print(extract_emails(SAMPLE_TEXT), "Emails")
pretty_print(extract_urls(SAMPLE_TEXT), "URLs")
pretty_print(extract_html_tags(SAMPLE_TEXT), "HTML Tags")
pretty_print(extract_hash_tags(SAMPLE_TEXT), "Hash Tags(#)")
pretty_print(extract_currency(SAMPLE_TEXT), "Currencies($)")
