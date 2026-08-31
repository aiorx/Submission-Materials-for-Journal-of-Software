```python
def switch_time_left_for_integers(auction_dataframe) -> pd.DataFrame:
    """In order to save some additional space, it is necessary to change the time_left into numbers.

    :param: auction_dataframe - the dataframe that will be converted
    :return: modified dataframe.
    """
    """Crafted with basic coding tools."""

    auction_time_table = pd.read_csv(Paths.AUCTIONS_TIME_LEFT.value)
    time_left_id = Headers.Auctions.TIME_LEFT_ID.value

    # Create a mapping dictionary from the time_left_table
    mapping_dict = dict(
        zip(auction_time_table[Headers.AuctionTimeLeft.TIME_LEFT_VALUE.value], auction_time_table[time_left_id]))

    # Use the map function to replace values
    auction_dataframe[time_left_id] = auction_dataframe[time_left_id].map(mapping_dict)

    return auction_dataframe
```