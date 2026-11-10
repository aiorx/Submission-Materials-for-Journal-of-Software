class D3Q19:
    # This is a basic D3Q19 Lattice Descriptor (thanks ChatGPT, this would have been ass to make by hand)
    Q = 19  # number of discrete velocity directions
    
    #discret velocity set
    e = np.array([
        [ 0,  0,  0], 
        [ 1,  0,  0], 
        [-1,  0,  0],  
        [ 0,  1,  0],  
        [ 0, -1,  0],  
        [ 0,  0,  1],  
        [ 0,  0, -1], 
        [ 1,  1,  0],  
        [-1,  1,  0],  
        [-1, -1,  0],  
        [ 1, -1,  0],  
        [ 1,  0,  1],  
        [-1,  0,  1],  
        [-1,  0, -1],  
        [ 1,  0, -1],  
        [ 0,  1,  1],  
        [ 0, -1,  1],  
        [ 0, -1, -1],  
        [ 0,  1, -1],  
    ])

    #  weights (from standard D3Q19 lattice)
    w = np.array([
        1/3,               
        1/18, 1/18,         
        1/18, 1/18,
        1/18, 1/18,
        1/36, 1/36,         
        1/36, 1/36,
        1/36, 1/36,
        1/36, 1/36,
        1/36, 1/36,
        1/36, 1/36
    ])

    #opposite directions for easier calculations
    opp = [
         0, 
         2, 1, 4, 3, 6, 5,
         9, 10, 7, 8,
        13, 14,11,12,
        17, 18,15,16
    ]