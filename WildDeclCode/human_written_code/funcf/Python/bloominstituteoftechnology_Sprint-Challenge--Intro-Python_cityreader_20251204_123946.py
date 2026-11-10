```python
def cityreader_stretch(lat1, lon1, lat2, lon2, cities=[]):
  # within will hold the cities that fall within the specified region
  within = []
  
  # Go through each city and check to see if it falls within 
  # the specified coordinates.
  lower_lat = min(lat1, lat2)
  upper_lat = max(lat1, lat2)
  lower_lon = min(lon1, lon2)
  upper_lon = max(lon1, lon2)

  for city in cities:
    if lower_lat <= city.lat <= upper_lat and lower_lon <= city.lon <= upper_lon:
      within.append(city)

  return within
```