```python
def create_dataframe(self,input_str):
    '''
Converts the input JSON Dictionary into a Pandas DataFrame.
Also Determines which values are stored / represented in the output CSV
Function initially Composed with basic coding tools and tweaked by hand :)
 '''
    # Converts input string into JSON object
    data = json.loads(input_str)
    # Retrieve Data Values
    try:
        timestamp = data['timestamp']
    except Exception:
        timestamp = ''
    server_id = data['server']['id']
    server_name = data['server']['name']
    location = data['server']['location']
    ip_address = data['interface']['externalIp']
    download_bandwidth = data['download']['bandwidth'] / 125000
    upload_bandwidth = data['upload']['bandwidth'] / 125000
    latency = data['ping']['latency']
    idle_jitter  = data['ping']['jitter']
    download_jitter  = data['download']['latency']['jitter']
    upload_jitter  = data['upload']['latency']['jitter']
    result_url = data['result']['url']
    # Generate new Dataframe with our New Values
    df = pd.DataFrame({
        'Mode': 'SpeedTest',
        'Timestamp': [timestamp],
        'Server Id': [server_id],
        'Server Name': [server_name],
        'Location': [location],
        'Client IP Address': [ip_address],
        'Download Bandwidth (Mbps)': [download_bandwidth],
        'Upload Bandwidth (Mbps)': [upload_bandwidth],
        'Latency' : [latency],
        'Idle Jitter': [idle_jitter],
        'Download Jitter': [download_jitter],
        'Upload Jitter': [upload_jitter],
        'Result URL': [result_url]
    })
    return df
```