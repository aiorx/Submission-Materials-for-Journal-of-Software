```python
def get_change_in_monthly_average_use_foreach_station(start_date: str, end_date: str):
    """
    This query returns the average monthly usage for a 3-month period, and is used in the 
    "Boroughs with Highest Change in Use" graph.
    The starting and ending periods are calculated using the parsed start and end date:
    As long as there is no overlap with the minimum start date, the start period will range from 45 days before
    the parsed start date, and 45 days after. If there is an overlap, the starting period will start at the minimum start date, 
    and extend 90 days. The same logic is applied to the end date, but the inverse.
    ------
    This was Formed using standard development resources since it's a very complicated query, and GPT is much better at SQL than me...
    But I tested the query in the GCP console with various edge cases by changing the output
    to tell me what the start and end dates were for each period.
    ------
    Generating SQL queries with AI can be erroneous - edge cases can be missed.
    It took me a couple of adjustments to the prompt for the query to cover all cases, but
    after the testing in the GCP console, and getting the expected start and end dates for each period,
    and also getting realistic data as a response, I was more than confident enough in the query to use it in this project.
    ------
    Edge cases included:
    - Setting the start date to the minimum start date in the DB. 
        - Expected: the star period started at the maximum end date, and ended 90 days after
        - Actual: AS EXPECTED
    - Setting the end date to the maximum end date in the DB. 
        - Expected: the ending period ends at the maximum end date, and starts 90 days prior
        - Actual: AS EXPECTED
    - Setting the start date just over 45 days after the minimum start date
        - Expected: the starting period would start just after the minimum start date
        - Actual: AS EXPECTED
    - Setting the end date just over 45 days before the maximum end date
        - Expected: the ending period would end just before the maximum end date
        - Actual: AS EXPECTED
    ------
    I also confirmed how GPT was calculating the monthly average:
    - It simply counted the number of rides across the 3 month periods, and divided it by 3, giving a monthly average of the number
    of rides for both the starting period and ending period.


    """
    query = f"""
    WITH params AS (
    SELECT
    DATE('2023-01-17') AS max_end_date,
    DATE('2015-01-04') AS min_start_date,
    DATE('{start_date}') AS user_start_date,  
    DATE('{end_date}') AS user_end_date     
    ),

    start_period AS (
    SELECT
        CASE
        WHEN DATE_SUB(user_start_date, INTERVAL 45 DAY) < min_start_date THEN min_start_date
        ELSE DATE_SUB(user_start_date, INTERVAL 45 DAY)
        END AS start_period_start,
        
        CASE
        WHEN DATE_SUB(user_start_date, INTERVAL 45 DAY) < min_start_date THEN DATE_ADD(min_start_date, INTERVAL 3 MONTH)
        WHEN DATE_ADD(user_start_date, INTERVAL 45 DAY) > max_end_date THEN max_end_date
        ELSE DATE_ADD(user_start_date, INTERVAL 45 DAY)
        END AS start_period_end
    FROM params
    ),

    end_period AS (
    SELECT
        CASE
        WHEN DATE_ADD(user_end_date, INTERVAL 45 DAY) > max_end_date THEN DATE_SUB(max_end_date, INTERVAL 3 MONTH)
        WHEN DATE_SUB(user_end_date, INTERVAL 45 DAY) < min_start_date THEN min_start_date
        ELSE DATE_SUB(user_end_date, INTERVAL 45 DAY)
        END AS end_period_start,

        CASE
        WHEN DATE_ADD(user_end_date, INTERVAL 45 DAY) > max_end_date THEN max_end_date
        ELSE DATE_ADD(user_end_date, INTERVAL 45 DAY)
        END AS end_period_end
    FROM params
    ),

    filtered_hires AS (
        SELECT
            start_station_id,
            start_date
        FROM
            `bigquery-public-data.london_bicycles.cycle_hire`
        WHERE
            start_station_id IS NOT NULL
            AND start_station_id < 876
    ),

    usage_start_period AS (
        SELECT
            start_station_id,
            ROUND(COUNT(*) / 3, 2) AS starting_period_avg
        FROM filtered_hires fh
        CROSS JOIN start_period sp
        WHERE DATE(fh.start_date) BETWEEN sp.start_period_start AND sp.start_period_end
        GROUP BY start_station_id
    ),

    usage_end_period AS (
        SELECT
            start_station_id,
            ROUND(COUNT(*) / 3, 2) AS ending_period_avg
        FROM filtered_hires fh
        CROSS JOIN end_period ep
        WHERE DATE(fh.start_date) BETWEEN ep.end_period_start AND ep.end_period_end
        GROUP BY start_station_id
    ),

    usage_comparison AS (
        SELECT
            COALESCE(s.start_station_id, e.start_station_id) AS station_id,
            s.starting_period_avg,
            e.ending_period_avg
        FROM usage_start_period s
        FULL OUTER JOIN usage_end_period e
        ON s.start_station_id = e.start_station_id
    )

    SELECT
    COALESCE(s.start_station_id, e.start_station_id) AS station_id,
    s.starting_period_avg,
    e.ending_period_avg
    FROM usage_start_period s
    FULL OUTER JOIN usage_end_period e
    ON s.start_station_id = e.start_station_id
    ORDER BY station_id;
    """

    query_job = client.query(query)

    response = query_job.to_dataframe().fillna(0).to_dict(orient="records")
    return response
```