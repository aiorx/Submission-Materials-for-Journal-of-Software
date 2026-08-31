```python
# function to convert the matches to hom. points
def convert_points(j):
    ndx = matches[j].nonzero()[0]
    fp = homography.make_homog(l[j+1][ndx,:2].T) 
    ndx2 = [int(matches[j][i]) for i in ndx]
    tp = homography.make_homog(l[j][ndx2,:2].T) 
    
    # switch x and y - TODO this should move elsewhere
    fp = vstack([fp[1],fp[0],fp[2]])
    tp = vstack([tp[1],tp[0],tp[2]])
    return fp,tp
```