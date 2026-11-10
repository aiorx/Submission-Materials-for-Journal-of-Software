```python
def generate_text(model, charX, numberOfUniqueChars, idsForChars, length=500):
    randomVal = np.random.randint(0, len(charX)-1)
    randomStart = charX[randomVal]
    for i in range(length):
        x = np.reshape(randomStart, (1, len(randomStart), 1))
        x = x/float(numberOfUniqueChars)
        pred = model.predict(x)
        index = np.argmax(pred)
        randomStart.append(index)
        randomStart = randomStart[1: len(randomStart)]
    return "".join([idsForChars[value] for value in randomStart])
```