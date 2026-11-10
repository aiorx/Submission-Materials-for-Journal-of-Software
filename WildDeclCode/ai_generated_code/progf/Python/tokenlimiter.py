import time
from threading import Lock

# Composed with basic coding tools with minimal intervention
class TokenLimiter:
    def __init__(self, max_tokens: int, period: float, callback: callable):
        self.max_tokens = max_tokens
        self.period = period
        self.callback = callback
        self.tokens = 0
        self.last_refill = time.monotonic()
        self.lock = Lock()

    def __enter__(self):
        return self.burn

    def __exit__(self, type, value, traceback):
        pass

    def burn(self, tokens: int):
        with self.lock:
            now = time.monotonic()
            self.tokens += (now - self.last_refill) * (self.max_tokens / self.period)
            self.tokens = min(self.max_tokens, self.tokens)
            self.last_refill = now

            if self.tokens < tokens:
                if self.callback:
                    self.callback(tokens)
                while self.tokens < tokens:
                    time.sleep((tokens - self.tokens) * self.period / self.max_tokens)
                    now = time.monotonic()
                    self.tokens += (now - self.last_refill) * (self.max_tokens / self.period)
                    self.last_refill = now
                    self.tokens = min(self.max_tokens, self.tokens)

            self.tokens -= tokens


# tested by ryanpeterz
def _run_tests(quota: int = 300, period: float = 1):
    tokenlimiter = TokenLimiter(quota, period,
                                callback=lambda t: print(f"Block@{time.monotonic()}"))

    start = time.monotonic()
    gas_spent = [0]

    def ex(n: int):
        print(f"Op costs {n} gas.")
        gas_spent[0] = gas_spent[0] + n
        gpm = gas_spent[0] / (time.monotonic() - start)
        assert gpm < (quota / period)
        print(f"Current gpm: {gpm}")
    
    with tokenlimiter as burn:
        for _ in range(10):
            burn(40)
            ex(40)


if __name__ == "__main__": _run_tests()    

