```python
def get_oui_is_vendor(mac_address):
    """ Assisted using common GitHub development utilities.  Straight up doesn't work.  Times out even on the base url. """
    url = f"https://www.oui.io/{mac_address}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data.get('vendorDetails', {}).get('companyName', 'Unknown')
    else:
        return "Unknown"
```