```python
def add_days_on_trending(df, video_id_col='video_id', trending_date_col='trending_date'):
    # Assisted with routine coding tools
    # Ensure the trending_date column is in datetime format
    df[trending_date_col] = pd.to_datetime(df[trending_date_col])

    # Get the earliest trending date for each video
    earliest_trending = df.groupby(video_id_col)[trending_date_col].min().reset_index()
    earliest_trending.columns = [video_id_col, 'earliest_trending_date']

    # Merge the earliest trending date back into the original dataframe
    df = df.merge(earliest_trending, on=video_id_col)

    # Calculate the number of days since the earliest trending date for each video
    df['days_on_trending'] = (df[trending_date_col] - df['earliest_trending_date']).dt.days + 1

    # Drop the 'earliest_trending_date' as it's no longer needed in the final DataFrame
    df = df.drop(columns=['earliest_trending_date'])

    return df
```
```python
def add_time_of_day_variables(df, output_column_modifier="", published_at_col='publishedAt'):
    #Assisted with routine coding tools
    # Ensure the publishedAt column is in datetime format
    df[published_at_col] = pd.to_datetime(df[published_at_col])
    # Extract the hour of day (0-23)
    df[output_column_modifier+'hour_of_day_published'] = df[published_at_col].dt.hour
    # Normalize the hour of day (0-1)
    df[output_column_modifier+'hour_published_normalized'] = df[output_column_modifier+'hour_of_day_published'] / 24
    # Categorize the time of day
    def get_time_of_day(hour):
        if 5 <= hour < 12:
            return 'morning'
        elif 12 <= hour < 17:
            return 'afternoon'
        elif 17 <= hour < 21:
            return 'evening'
        else:
            return 'night'
    df[output_column_modifier+'time_of_day_published'] = df[output_column_modifier+'hour_of_day_published'].apply(get_time_of_day)
    return df
```
```python
def add_day_of_week(df, published_at_col='publishedAt', trending_date_col='trending_date'):
    #Assisted with routine coding tools
    # Ensure the columns are in datetime format
    df[published_at_col] = pd.to_datetime(df[published_at_col])
    df[trending_date_col] = pd.to_datetime(df[trending_date_col])
    # Get the day name for the published day
    df['day_of_week_published'] = df[published_at_col].dt.day_name()
    # Get the day name for the trending day
    df['trending_day_of_week'] = df[trending_date_col].dt.day_name()
    return df
```
```python
def calculate_average_days_on_trending(df):
    #Assisted with routine coding tools
    # Ensure the publishedAt column is in datetime format
    df['publishedAt'] = pd.to_datetime(df['publishedAt'])
    # Sort the DataFrame by channelID and publishedAt to ensure chronological order
    df.sort_values(by=['channelId', 'publishedAt'], ascending=True, inplace=True)
    # Initialize a dictionary to keep track of the last day on trending for each video
    last_days_on_trending = {}
    # Initialize the column for the average number of days on trending
    df['previous_avg_days_on_trending'] = pd.Series(dtype=float)
    # Iterate over the DataFrame row by row
    for index, current_row in df.iterrows():
        channel_videos = last_days_on_trending.get(current_row['channelId'], {})
        # If there are previous videos, calculate the average
        if channel_videos:
            df.at[index, 'previous_avg_days_on_trending'] = pd.Series(channel_videos.values()).mean()
        # Update the last days on trending for the current video
        channel_videos[current_row['video_id']] = current_row['last_video_days_on_trending']
        # Store the updated list back in the dictionary
        last_days_on_trending[current_row['channelId']] = channel_videos
    return df
```