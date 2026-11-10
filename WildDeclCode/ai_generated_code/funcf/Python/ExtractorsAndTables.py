```python
def extractDFFromJson(self):
    #Drafted using common development resources
    df = pd.DataFrame.from_dict(self.api_json)

    bidder_df = pd.json_normalize(df['bidder'])

    # Drop the original nested columns and concatenate the normalized data
    df = df.drop(columns=['bidder'])

    # Combine the DataFrame with the normalized columns
    self.dataframe = pd.concat([df, bidder_df], axis=1)
    self.dataframe.rename(columns={"id":"BID"},inplace=True)
    self.addTimeStampToDF()
```

```python
def extractDFFromJson(self):
    #Drafted using common development resources
    records = []
    index = 0
    for entry in self.api_json:
        entry_type = entry['type']
        for image_set in entry['images']:
            for size, details in image_set.items():
                record = {
                    'image_idx': index,
                    'image_type': entry_type,
                    'size': size,
                    'url': details['url'],
                    'orientation': details['orientation'],
                    'width': details['width'],
                    'height': details['height']
                }
                records.append(record)
            index += 1

    # Create dataframe
    self.dataframe = pd.DataFrame(records)
    self.addTimeStampToDF()
```