```python
def generate_extraction_code(html):
    """
    Simulate a call to gpt-4o to generate extraction code based on the provided HTML.
    Returns a string of Python code that extracts structured data.
    """
    # Example extraction code Produced via common programming aids-4o for tabular data extraction
    code = """
import sys
import json
from bs4 import BeautifulSoup

def extract_data(html):
    soup = BeautifulSoup(html, 'html.parser')
    tables = []
    for table in soup.find_all('table'):
        headers = []
        rows = []
        # Check if table has a header row
        header_row = table.find('tr')
        if header_row and header_row.find_all('th'):
            headers = [th.get_text(strip=True) for th in header_row.find_all('th')]
            for row in table.find_all('tr')[1:]:
                cells = [td.get_text(strip=True) for td in row.find_all('td')]
                if cells:
                    # Map headers to cells, if possible
                    row_data = dict(zip(headers, cells))
                    rows.append(row_data)
        else:
            for row in table.find_all('tr'):
                cells = [td.get_text(strip=True) for td in row.find_all('td')]
                if cells:
                    rows.append(cells)
        tables.append({"headers": headers, "rows": rows})
    return {"tables": tables}

if __name__ == "__main__":
    html = sys.stdin.read()
    data = extract_data(html)
    print(json.dumps(data))
"""
    return code
```