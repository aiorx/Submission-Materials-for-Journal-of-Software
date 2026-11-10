```python
def randomPointOnSphere(self, rand:'random.Random', minDistance=0.5, maxDistance=1):
    # This Function was actually Penned via standard programming aids4o
    # It usually only produces un-useable garbage code but it got this method right 2nd try!
    
    # Ensure minDistance is less than or equal to maxDistance
    if minDistance > maxDistance:
        raise ValueError("minDistance must be less than or equal to maxDistance")
    
    # Generate a random distance between minDistance and maxDistance
    distance = rand.uniform(minDistance, maxDistance)
    
    # Generate a random azimuthal angle theta between 0 and 2*pi
    theta = rand.uniform(0, 2 * math.pi)
    
    # Generate a uniform random value for cos(phi) between -1 and 1
    cos_phi = rand.uniform(-1, 1)
    
    # Calculate the polar angle phi from cos_phi
    phi = math.acos(cos_phi)
    
    # Convert spherical coordinates to Cartesian coordinates
    x = distance * math.sin(phi) * math.cos(theta)
    y = distance * math.sin(phi) * math.sin(theta)
    z = distance * math.cos(phi)
    
    return p3dc.Vec3(x,y,z)
```