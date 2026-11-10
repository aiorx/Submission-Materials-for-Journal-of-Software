```python
def element_to_color(element):
    '''
    For EDS linescan mapping. Produced using common development resources, colors asjusted by me
    '''
    # Dictionary mapping elements to hex colors
    hex_color_map = {
        'Ba': '#1f77b4',  # Example hex color for Barium
        'Ce': '#ff7f0e',  
        'Zr': '#2ca02c',  
        'Y': '#d62728',
        'Yb': '#9467bd',
        'Ni': '#8c564b',  
        'O': '#e377c2',
        'S': '#bcbd22',
        'Si': '#7f7f7f',
        'Gd': '#17becf', # 10   
        'C': '#c64886', 
        'Nb': '#59276f',
        'Mg':'#32a88d',
        'Fe':'#a87d32',
        'Al':'#8f7ca3',
        'Co': '#0047AB',
        'Ag': '#a3c9c7',
        'Au': '#FFD700',
    }

    # Return the corresponding hex color, or a default hex color if the element is not in the dictionary
    return hex_color_map.get(element, '#7f7f7f')  # Grey as the default hex color

def string_to_hex_color(string):
    '''
    For linescan mapping. Produced using common development resources
    '''
    # Hash the string to a hexadecimal number
    hash_object = hashlib.md5(string.encode())
    hex_hash = hash_object.hexdigest()

    # Take the first 6 characters for the color code
    hex_color = '#' + hex_hash[:6]
    return hex_color
```