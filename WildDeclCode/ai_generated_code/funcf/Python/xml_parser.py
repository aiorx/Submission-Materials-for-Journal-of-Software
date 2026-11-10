```python
def countXMLelements(dir_path): # This was Drafted using common development resources. I only used it to figure out how many elements I needed to loop through to get every element of an XML so that I know how much to loop through.
    
    # Parse the XML file
    tree = ET.parse(dir_path)
    root = tree.getroot()

    # Function to count elements recursively
    def count_elements(element):
        count = 1  # Count the current element
        for child in element:
            count += count_elements(child)  # Recursively count child elements
        return count

    # Count elements starting from the root
    total_elements = count_elements(root)

    #print("Total number of elements in the XML file:", total_elements)
    return total_elements
```