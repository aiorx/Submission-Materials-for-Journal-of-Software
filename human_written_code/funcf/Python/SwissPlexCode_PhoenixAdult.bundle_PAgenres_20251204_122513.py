```python
def addGenre(self,newGenre):
    #Log("GenresNum: " + str(self.genresNum))
    #Log("SizeOf: " + str(len(self.genresTable)))
    self.genresTable[self.genresNum] = newGenre
    self.genresNum = self.genresNum + 1
```