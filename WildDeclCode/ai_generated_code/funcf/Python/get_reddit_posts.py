```python
def fetch_url(url, retries=3, delay=5):
    """Designed via basic programming aids, function that will fetch again if there's an error"""
    attempt = 0
    while attempt < retries:
        try:
            response = requests.get(url, headers={
                'User-Agent': '"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"'})
            if response.status_code == 500:
                print(f"Server error (500). Retrying in {delay} seconds...")
                attempt += 1
                time.sleep(delay)
            elif response.status_code == 408:
                print(f"Request timeout (408). Retrying in {delay} seconds...")
                attempt += 1
                time.sleep(delay)
            else:
                response.raise_for_status()  # Raise an HTTPError for other bad responses (4xx and 5xx)
                return response
        except (HTTPError, Timeout) as e:
            print(f"Error occurred: {e}. Retrying in {delay} seconds...")
            attempt += 1
            time.sleep(delay)
        except RequestException as e:
            print(f"RequestException occurred: {e}. Aborting...")
            raise e
    print("Max retries exceeded. Aborting...")
    return None
```