```python
def test_password_not_correct_salt_is_None(mock_conn):
    # Penned via standard programming aids

    initials = "test_initials"
    password = "test_password"
    fake_salt = b"fake_salt"
    fake_hash = b"fake_hashed_password"

    # Mock cursor and connection
    mock_cursor = MagicMock()
    mock_conn = MagicMock()

    # Set up the cursor's behavior
    mock_conn.cursor.return_value = mock_cursor

    # Test when both salt and password hash are present
    mock_cursor.fetchone.side_effect = [(fake_salt,), (fake_hash,)]
    with patch('sqlite3.connect', return_value=mock_conn):
        assert login.password_correct(mock_conn, initials, password) == (fake_hash == login.hash_password(password, fake_salt)[1])  # noqa

    # Test when salt is not present
    mock_cursor.fetchone.side_effect = [None, fake_hash]
    with patch('sqlite3.connect', return_value=mock_conn):
        assert not login.password_correct(mock_conn, initials, password)
```