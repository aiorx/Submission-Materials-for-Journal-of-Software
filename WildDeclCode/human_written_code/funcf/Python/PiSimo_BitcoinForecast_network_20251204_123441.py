```python
def chart(real,predicted,show=True):
    plt.plot(real,color='g')
    plt.plot(predicted,color='r')
    plt.ylabel('BTC/USD')
    plt.xlabel("9Minutes")
    plt.savefig("chart.png")
    if show:plt.show()
```