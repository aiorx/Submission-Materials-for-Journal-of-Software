```python
def gen_butter_poly(n): #Crafted with basic coding tools replace this later with manual shit
    # Get complex conjugate pole pairs on left half-plane unit circle
    poles = [np.exp((-1j * np.pi * ((k + 1/2) / n + 1/2))) for k in range(n)]
    poly = np.poly(poles)  # converts roots → poly coefficients
    return poly.real.tolist()  # Should be real due to symmetry
```