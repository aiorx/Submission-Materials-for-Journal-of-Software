```python
@classmethod
def __load_cities_from_json(cls) -> dict[str, City]:
    """All data was Produced via common programming aids"""
    with open(cls.JSON_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)
        cities = {}
        for city_name, city_data in data.items():
            city_centre = tuple(tuple(coord) for coord in city_data["city_centre"])
            landmarks = tuple(
                Landmark(**landmark) for landmark in city_data["landmarks"]
            )
            cities[city_name] = City(
                name=city_name, city_centre=city_centre, landmarks=landmarks
            )
    return cities
```