```python
from numpy import random

n = 1000 #number of points to create
xcord1 = []; ycord1 = []
xcord2 = []; ycord2 = []
xcord3 = []; ycord3 = []
markers =[]
colors =[]

def generate_data_points(n):
    for i in range(n):
        [r0,r1] = random.standard_normal(2)
        myClass = random.uniform(0,1)
        if (myClass <= 0.16):
            fFlyer = random.uniform(22000, 60000)
            tats = 3 + 1.6*r1
            markers.append(20)
            colors.append(2.1)
            classLabel = 1 #'didntLike'
            xcord1.append(fFlyer); ycord1.append(tats)
        elif ((myClass > 0.16) and (myClass <= 0.33)):
            fFlyer = 6000*r0 + 70000
            tats = 10 + 3*r1 + 2*r0
            markers.append(20)
            colors.append(1.1)
            classLabel = 1 #'didntLike'
            if (tats < 0): tats =0
            if (fFlyer < 0): fFlyer =0
            xcord1.append(fFlyer); ycord1.append(tats)
        elif ((myClass > 0.33) and (myClass <= 0.66)):
            fFlyer = 5000*r0 + 10000
            tats = 3 + 2.8*r1
            markers.append(30)
            colors.append(1.1)
            classLabel = 2 #'smallDoses'
            if (tats < 0): tats =0
            if (fFlyer < 0): fFlyer =0
            xcord2.append(fFlyer); ycord2.append(tats)
        else:
            fFlyer = 10000*r0 + 35000
            tats = 10 + 2.0*r1
            markers.append(50)
            colors.append(0.1)
            classLabel = 3 #'largeDoses'
            if (tats < 0): tats =0
            if (fFlyer < 0): fFlyer =0
            xcord3.append(fFlyer); ycord3.append(tats)
```