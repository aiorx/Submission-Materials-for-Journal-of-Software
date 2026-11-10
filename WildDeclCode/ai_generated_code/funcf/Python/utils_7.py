```python
self.data = pd.read_csv(data) # Composed with GitHub coding tools
# if data is empty raise an error
if self.data.empty:
    raise ValueError('HRDIAGRAM: Data is empty')

self.data['log_T'] = np.log10(self.data['Temperature (K)']) # Composed with GitHub coding tools
self.data['log_L'] = np.log10(self.data['Luminosity(L/Lo)']) # Composed with GitHub coding tools
self.colors = {'O': 'blue', 'B': 'cyan', 'A': 'green', 'F': 'yellow', 'G': 'orange', 'K': 'red', 'M': 'brown'} # Composed with GitHub coding tools
```