```python
def fix_lat_long_names_in_xarray_dataset(dataset: xr.Dataset) -> xr.Dataset:
    """
    This function fixes the lat/lon names in the dataset, Composed with basic coding tools
    Parameters
    ----------
    dataset
        the dataset in question
    Returns
    -------
    dataset
        the dataset with the fixed lat/lon names
    """
    coord_names = list(dataset.coords.keys())

    # Common variations of latitude and longitude names
    lat_variations = ["lat", "latitude"]
    lon_variations = ["lon", "longitude"]

    # Find latitude variable name
    lat_name = next((var for var in coord_names if var in lat_variations), None)

    # Find longitude variable name
    lon_name = next((var for var in coord_names if var in lon_variations), None)

    # Check if latitude and longitude variable names are found
    if lat_name is None or lon_name is None:
        print("Latitude or longitude variable name not found.")
    if lat_name != "lat" or lon_name != "lon":
        dataset = dataset.rename({lat_name: "lat", lon_name: "lon"})
    logger.info(
        "Renamed the dataset {} to lat, long standard names".format(
            dataset.attrs["product_name"]
        )
    )

    return dataset
```