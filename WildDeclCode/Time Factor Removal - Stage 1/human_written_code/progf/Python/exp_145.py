import pytest

from topgg.ratelimiter import Ratelimiter

n = period = 10


@pytest.fixture
def limiter() :
    return Ratelimiter(max_calls=n, period=period)


@pytest.mark.asyncio
async def test_AsyncRateLimiter_calls(limiter) :
    for _ in range(n):
        async with limiter:
            pass

    assert len(limiter._Ratelimiter__calls) == limiter._Ratelimiter__max_calls == n


@pytest.mark.asyncio
async def test_AsyncRateLimiter_timespan_property(limiter) :
    for _ in range(n):
        async with limiter:
            pass

    assert limiter._timespan < period
