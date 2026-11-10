@pytest.mark.django_db
def test_not_active_customers(django_db_setup):
    result = not_active_customers()
    assert list(result) == [
        {"customer__first_name": "Alona"},
        {"customer__first_name": "Dariia"},
        {"customer__first_name": "Ivanna"},
    ]