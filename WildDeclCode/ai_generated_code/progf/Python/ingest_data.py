import requests
import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime

# Function to download a file 
def download_file(url):
    local_filename = url.split('/')[-1]
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    return local_filename
# the above code was Written with routine coding tools-4 

def read_file_and_get_schema(file_path):
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    elif file_path.endswith('.parquet'):
        df = pd.read_parquet(file_path)
    else:
        raise ValueError("Unsupported file format")
    print("b")
    return df,len(df)

def preprocess_data (df):
    df.lpep_pickup_datetime = pd.to_datetime(df.lpep_pickup_datetime)
    df.lpep_dropoff_datetime = pd.to_datetime(df.lpep_dropoff_datetime)
    print("c")
    return df 


def create_schema_insert_data(df,table_name,engine):
    t1 = datetime.now()
    a= df.to_sql(name=table_name, con=engine, if_exists='replace',index=False, method='multi', chunksize=10000)
    t2 = datetime.now()
    x = t2-t1
    return a,x


if __name__=="__main__":
    url = "https://s3.amazonaws.com/nyc-tlc/misc/taxi+_zone_lookup.csv"
    file_name = download_file(url)
    df,ldf= read_file_and_get_schema(file_name)
    print(ldf)
    # pre_df = preprocess_data(df)
    pre_df = df
    engine = create_engine("postgresql://postgres:postgres@localhost:5432/taxi_data")
    table_name = "zone_lookup"
    rows_inserted,timetaken = create_schema_insert_data(pre_df,table_name,engine)
    if rows_inserted is None:
        print("There was an error in the query.")
    else:
        print(f"{rows_inserted} rows were successfully inserted in {timetaken}")
        
        #640008 rows were successfully inserted in 0:20:03.509146

