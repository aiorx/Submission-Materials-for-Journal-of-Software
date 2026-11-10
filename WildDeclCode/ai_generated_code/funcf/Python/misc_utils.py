```python
def MADN(image):
    '''
    Produced using common development resources
    '''
    image = np.squeeze(np.array(image))

    assert len(image.shape) == 2, "image must be 2-dimensional. Received "+str(image.shape) 
    #----------------------------------------------------------------

    rows, cols = image.shape
    
    avg_diff = np.ones((rows, cols)) * -999
    
    neighbor_offsets = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]

    for i in range(rows):
        for j in range(cols):
            # Collect the values of the neighboring pixels
            neighbors = []
            for offset in neighbor_offsets:
                ni, nj = i + offset[0], j + offset[1]
                if 0 <= ni < rows and 0 <= nj < cols:
                    neighbors.append(image[ni, nj])
            
            # Calculate the average difference
            if neighbors:
                avg_diff[i, j] = np.mean([abs(image[i, j] - neighbor) for neighbor in neighbors])
                #print("i=", i, ", j=", j, ", im =", image[i, j], ", n =", neighbors)
    return avg_diff
```