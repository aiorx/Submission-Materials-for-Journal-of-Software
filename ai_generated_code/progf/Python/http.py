#
#  http.py
#
#
#   Composed with basic coding tools
#
import requests

response = requests.get("https://api.github.com")
if response.status_code == 200:
    print("GitHub API is reachable!")
    print("Response JSON:", response.json())  # Print JSON data
else:
    print("Failed to reach API.")

print("Everything is good now")
