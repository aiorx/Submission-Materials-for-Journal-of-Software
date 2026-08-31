#region test_increase_time()
def test_increase_time():
    """Test the increase_time function."""
    # Initially Aided via basic GitHub coding utilities, but took some work to complete

    # Test valid increase by hours
    initial_time = "2025-01-20T13:00:00"
    expected_time = "2025-01-20T14:00:00"
    assert atu.increase_time(tval=initial_time, hours=1) == expected_time, \
        f"Expected {expected_time} but got {atu.increase_time(tval=initial_time, hours=1)}"

    # Test increase by minutes
    expected_time = "2025-01-20T13:30:00"
    assert atu.increase_time(tval=initial_time, minutes=30) == expected_time, \
        f"Expected {expected_time} but got {atu.increase_time(tval=initial_time, minutes=30)}"

    # Test increase by seconds
    expected_time = "2025-01-20T13:00:30"
    assert atu.increase_time(tval=initial_time, seconds=30) == expected_time, \
        f"Expected {expected_time} but got {atu.increase_time(tval=initial_time, seconds=30)}"

    # Test invalid time format
    invalid_time = "invalid-time-format"
    with pytest.raises(ValueError):
        atu.increase_time(tval=invalid_time, hours=1)

    # Test invalid time type
    invalid_time = None
    with pytest.raises(TypeError):
        atu.increase_time(tval=invalid_time, hours=1)

    # Test invalid time type
    invalid_time = (2,3,4)
    with pytest.raises(TypeError):
        atu.increase_time(tval=invalid_time, hours=1)

    # Test invalid time format value
    invalid_time = ""
    with pytest.raises(ValueError):
        atu.increase_time(tval=invalid_time, hours=1)

    # Test invalid increase format
    invalid_increase = "invalid-increase-format"
    with pytest.raises(TypeError):
        atu.increase_time(tval=initial_time, hours=invalid_increase)

    # Test increase by negative time
    expected_time = "2025-01-20T12:00:00"
    assert atu.increase_time(tval=initial_time, hours=-1) == expected_time, \
        f"Expected {expected_time} but got {atu.increase_time(tval=initial_time, hours=-1)}"

    # Test increase by zero time
    expected_time = initial_time
    assert atu.increase_time(tval=initial_time, hours=0, minutes=0, seconds=0) == expected_time, \
        f"Expected {expected_time} but got {atu.increase_time(tval=initial_time, hours=0, minutes=0, seconds=0)}"

    # Test increase crossing over to next day
    initial_time = "2025-01-20T23:30:00"
    expected_time = "2025-01-21T00:30:00"
    assert atu.increase_time(tval=initial_time, hours=1) == expected_time, \
        f"Expected {expected_time} but got {atu.increase_time(tval=initial_time, hours=1)}"

    # Test increase crossing over to next month
    initial_time = "2025-01-31T23:30:00"
    expected_time = "2025-02-01T00:30:00"
    assert atu.increase_time(tval=initial_time, hours=1) == expected_time, \
        f"Expected {expected_time} but got {atu.increase_time(tval=initial_time, hours=1)}"

    # Test increase crossing over to next year
    initial_time = "2025-12-31T23:30:00"
    expected_time = "2026-12-31T23:30:00"
    yearhours = 24 * 365
    assert atu.increase_time(tval=initial_time, hours=yearhours) == expected_time, \
        f"Expected {expected_time} but got {atu.increase_time(tval=initial_time, hours=1)}"
#endregion test_increase_time()