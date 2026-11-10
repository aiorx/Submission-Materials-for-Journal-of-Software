```python
def quad_root(r, s):
	disc = r**2 + 4*s
	if disc > 0:
		r1 = (r + cmath.sqrt(disc))/2
		r2 = (r - cmath.sqrt(disc))/2
		i1 = 0
		i2 = 0
	else:
		r1 = r/2
		r2 = r1
		i1 = cmath.sqrt(abs(disc))/2
		i2 = -i1
	return complex(r1,i1), complex(r2,i2)
```