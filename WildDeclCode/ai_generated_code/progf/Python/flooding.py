"""
Implements flooding for events.

If there's a gap shorter than pulsetime between two events with the same data (including overlap), merge the two events.
If there's a non-zero gap shorter than pulsetime between two events with differing data, fill it with a dummy event.
If two events with different data overlap, log a warning.

Used in ActivityWatch, the free and open source automated time tracker.
Cleanroom rewrite of the original implementation in aw-core, using GitHub Copilot as guide.
"""

from aw_core import Event
from typing import Generator


def flood_single(e1: Event, e2: Event, pulsetime: int) -> Generator[Event, None, None]:
    """Checks if theres a gap between e1 and e2, and if so, fills it with a dummy event."""

    # if there's a gap shorter than pulsetime, fill it with a dummy event
    e1_end = e1.timestamp + e1.duration
    gap = e2.timestamp - e1_end
    gap_s = gap.total_seconds()
    if 0 < gap_s < pulsetime:
        yield e1
        yield Event(timestamp=e1_end, duration=gap, data={"type": "dummy"})
        yield e2
        return

    # if there's some overlap
    if gap_s < 0:
        # if events are partially overlapping and share data, merge them
        if e1.data == e2.data:
            e2_end = e2.timestamp + e2.duration
            # if e2 is entirely in e1, just yield e1
            if e2_end < e1.timestamp + e1.duration:
                yield e1
            else:
                new_duration = e2_end - e1.timestamp
                yield Event(timestamp=e1.timestamp, duration=new_duration, data=e1.data)
            return
        else:
            # log a warning if events are partially overlapping and have different data
            print("Warning: events partially overlapping and have differing data")
            print(e1)
            print(e2)

    yield e1
    yield e2


def flood(events: list[Event], pulsetime: int = 5):
    """
    Goes through events one by one, checking for gaps and overlaps.
    Tries to remove gaps shorter than `pulsetime` seconds by filling the time with a dummy event.
    Overlaps should log warnings only if the event data differs.
    Overlaps with the same data are merged into a single event.

    Care needs to be taken with how the events are processed, as the order of events is important, and flood_single can yield one or two events for each two events passed.
    """
    events = sorted(events, key=lambda e: e.timestamp)
    i = len(events) - 1
    while i >= 1:
        e1 = events[i - 1]
        e2 = events[i]
        events_flooded = [e for e in flood_single(e1, e2, pulsetime)]
        events[i - 1 : i + 1] = events_flooded
        i -= 1
    return events


from datetime import datetime, timedelta, timezone


def test_flood():
    # test the flood function with perfectly aligned event, ensure that it yields the same events

    # example events
    now = datetime.now(tz=timezone.utc)
    events = [
        Event(timestamp=now, duration=10, data={"type": "a"}),
        Event(timestamp=now + timedelta(seconds=10), duration=10, data={"type": "b"}),
        Event(timestamp=now + timedelta(seconds=20), duration=10, data={"type": "c"}),
    ]

    # flood the events
    events_flooded = list(flood(events, pulsetime=5))

    # check the result
    assert events_flooded == events


def test_flood_single():
    now = datetime.now(tz=timezone.utc)
    events = [
        Event(timestamp=now, duration=10, data={"type": "a"}),
    ]

    # flood the events
    events_flooded = list(flood(events, pulsetime=5))

    assert events == events_flooded


def test_flood_small_gap():
    now = datetime.now(tz=timezone.utc)
    events = [
        Event(timestamp=now, duration=8, data={"type": "a"}),
        Event(timestamp=now + timedelta(seconds=10), duration=8, data={"type": "b"}),
        Event(timestamp=now + timedelta(seconds=20), duration=10, data={"type": "c"}),
    ]

    # flood the events
    events = list(flood(events, pulsetime=5))

    # check the result
    assert len(events) == 5
    assert events[0].data == {"type": "a"}
    assert events[0].duration == timedelta(seconds=8)
    assert events[1].data == {"type": "dummy"}
    assert events[1].duration == timedelta(seconds=2)
    assert events[2].data == {"type": "b"}
    assert events[3].data == {"type": "dummy"}
    assert events[4].data == {"type": "c"}

    # check idempotence
    assert list(flood(events, pulsetime=5)) == events


def test_flood_overlap_same_data():
    now = datetime.now(tz=timezone.utc)
    events = [
        Event(timestamp=now, duration=15, data={"type": "a"}),
        Event(timestamp=now + timedelta(seconds=10), duration=10, data={"type": "a"}),
        Event(timestamp=now + timedelta(seconds=15), duration=10, data={"type": "a"}),
    ]

    # flood the events
    events = list(flood(events, pulsetime=5))

    # check the result
    assert len(events) == 1
    assert events[0].data == {"type": "a"}
    assert events[0].duration == timedelta(seconds=25)

    # check idempotence
    assert list(flood(events, pulsetime=5)) == events


def test_flood_overlap_different_data():
    # test what happens when overlapping events have differing data
    now = datetime.now(tz=timezone.utc)
    events = [
        Event(timestamp=now, duration=15, data={"type": "a"}),
        Event(timestamp=now + timedelta(seconds=10), duration=10, data={"type": "b"}),
    ]

    # flood the events
    events = list(flood(events, pulsetime=5))

    # check the result
    # NOTE: does nothing for now
    assert len(events) == 2
    assert events[0].data == {"type": "a"}
    assert events[0].duration == timedelta(seconds=15)
    assert events[1].data == {"type": "b"}
    assert events[1].duration == timedelta(seconds=10)

    # check idempotence
    assert list(flood(events, pulsetime=5)) == events


def test_flood_wrapped():
    # test flooding when an event is entirely contained within another event, with the same data
    now = datetime.now(tz=timezone.utc)
    events = [
        Event(timestamp=now, duration=15, data={"type": "a"}),
        Event(timestamp=now + timedelta(seconds=5), duration=5, data={"type": "a"}),
    ]

    # flood the events
    events = list(flood(events, pulsetime=5))

    # check the result
    assert len(events) == 1
    assert events[0].data == {"type": "a"}
    assert events[0].duration == timedelta(seconds=15)


def test_flood_adversarial():
    # test flooding for an adversarial case with multiple overlapping events
    now = datetime.now(tz=timezone.utc)
    events = [
        Event(timestamp=now, duration=15, data={"type": "a"}),
        Event(timestamp=now + timedelta(seconds=10), duration=10, data={"type": "b"}),
        Event(timestamp=now + timedelta(seconds=15), duration=10, data={"type": "c"}),
        Event(timestamp=now + timedelta(seconds=20), duration=10, data={"type": "d"}),
        Event(timestamp=now + timedelta(seconds=25), duration=10, data={"type": "e"}),
        Event(timestamp=now + timedelta(seconds=30), duration=10, data={"type": "f"}),
        Event(timestamp=now + timedelta(seconds=35), duration=10, data={"type": "g"}),
        Event(timestamp=now + timedelta(seconds=40), duration=10, data={"type": "h"}),
        Event(timestamp=now + timedelta(seconds=45), duration=10, data={"type": "i"}),
        Event(timestamp=now + timedelta(seconds=50), duration=10, data={"type": "j"}),
        Event(timestamp=now + timedelta(seconds=55), duration=10, data={"type": "k"}),
        Event(timestamp=now + timedelta(seconds=60), duration=10, data={"type": "l"}),
        Event(timestamp=now + timedelta(seconds=65), duration=10, data={"type": "m"}),
        Event(timestamp=now + timedelta(seconds=70), duration=10, data={"type": "n"}),
    ]

    # total range of events
    assert events[-1].timestamp - events[0].timestamp == timedelta(seconds=70)

    # flood the events
    events = list(flood(events, pulsetime=5))
