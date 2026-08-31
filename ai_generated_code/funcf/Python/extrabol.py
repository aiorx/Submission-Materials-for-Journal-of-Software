```python
def read_snana_file(file_path):
    '''
    Reads a SNANA file and extracts metadata and observational data.
    Composed with basic coding tools! Thanks, ChatGPT.

    Parameters
    ----------
    file_path : str
        The path to the SNANA file.

    Returns
    -------
    metadata : dict
        A dictionary containing the metadata from the file. Metadata includes all lines before the "NOBS" line that lack a hashtag/pound sign.
        If a value contains a '+-' (e.g., '0.0076 +- 0.0003'), only the float value before '+-' is extracted.
    data_df : pandas.DataFrame
        A pandas DataFrame containing the observational data. The columns are defined by the 'VARLIST' line, and the observations follow the 'OBS' lines.
        Each row corresponds to an observation, with columns as specified in 'VARLIST'.
    
    Example
    -------
    >>> metadata, data_df = read_snana_file('path_to_your_snana_file.txt')
    >>> print(metadata)
    {'SURVEY': 'Archival', 'SNID': 'SN2010bc', 'IAUC': 'SN2010bc', 'RA': '162.02942', 'DECL': '56.85011', 'MWEBV': '0.0076', 'REDSHIFT_FINAL': '0.2440', 'SEARCH_PEAKMJD': '55222.5', 'FILTERS': 'griz'}
    >>> print(data_df.head())
          MJD                  FLT        MAG     MAGERR MAGTYPE
    0  55173.6  PAN-STARRS/PS1.g  26.213299   3.420972      AB
    1  55191.6  PAN-STARRS/PS1.g  29.423878  60.670588      AB
    '''

    metadata = {}
    data_lines = []
    varlist = []
    header_found = False

    with open(file_path, 'r') as file:
        for line in file:
            stripped_line = line.strip()

            if stripped_line.startswith('#'):
                continue

            if stripped_line.startswith('NOBS'):
                header_found = True
                continue

            if not header_found:
                if ':' in line:
                    key, value = line.split(':', 1)
                    value = value.strip()
                    # Check for +- and extract only the float value before the +-
                    if '+-' in value:
                        value = value.split('+-')[0].strip()
                    # Extract float value if present
                    float_value = re.findall(r"[-+]?\d*\.\d+|\d+", value)
                    if float_value:
                        value = float_value[0]
                    metadata[key.strip()] = value
            else:
                if line.startswith('VARLIST:'):
                    varlist = line.split()[1:]
                elif line.startswith('OBS:'):
                    data_lines.append(line.split()[1:])

    # Create pandas DataFrame from observation data
    if varlist and data_lines:
        data_df = pd.DataFrame(data_lines, columns=varlist)
        # Identify columns that should remain as strings
        str_columns = ['FLT', 'MAGTYPE']
        # Convert numeric columns to appropriate data types
        for col in varlist:
            if col not in str_columns:
                data_df[col] = pd.to_numeric(data_df[col], errors='coerce')

    return metadata, data_df
```