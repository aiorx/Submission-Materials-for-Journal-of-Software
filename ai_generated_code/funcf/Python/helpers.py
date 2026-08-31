```python
def get_filtered_predictions_by_date(db_session, index):
    # Crafted with basic coding tools based on get_filtered_matches_by_date
    round_list = get_game_rounds()

    if index < 0 or index >= len(round_list):
        raise IndexError("Invalid index for game rounds.")
    
    start_date, end_date = round_list[index]

    # Adjust the end_date to include the entire last day
    end_date = end_date

    predictions = db_session.query(Prediction).select_from(Prediction).join(
        Match, Prediction.match_id == Match.id
    ).filter(
        and_(
            Match.matchDateTime >= start_date,
            Match.matchDateTime < end_date
        )
    ).all()

    return predictions
```