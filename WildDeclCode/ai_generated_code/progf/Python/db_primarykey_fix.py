## Assisted with routine coding tools don't judge me, I just needed to fix the db error lol
## Run like: python db_primarykey_fix.py --host YourIP --database YourDatabaseName --user YourUsername --password YourPassword

import argparse
import mysql.connector
from mysql.connector import Error

def modify_tables(database_name, user, password, host):
    try:
        # Connect to the database
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database_name
        )

        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"Connected to MySQL Server version {db_info}")
            cursor = connection.cursor()
            
            # Retrieve all table names in the database
            cursor.execute(f"SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = '{database_name}';")
            tables = cursor.fetchall()
            
            # Loop through all tables and modify the 'id' column
            for (table_name,) in tables:
                try:
                    alter_query = f"""
                    ALTER TABLE {table_name} 
                    CHANGE COLUMN id id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
                    ADD PRIMARY KEY (id);
                    """
                    cursor.execute(alter_query)
                    connection.commit()
                    print(f"Table {table_name} modified successfully.")
                except Error as e:
                    print(f"Error occurred while modifying table {table_name}: {e}")

    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")

def main():
    parser = argparse.ArgumentParser(description="Modify tables in a MySQL database to set the 'id' column as AUTO_INCREMENT and a primary key.")
    parser.add_argument('--host', type=str, required=True, help='Database host IP address')
    parser.add_argument('--database', type=str, required=True, help='Database name')
    parser.add_argument('--user', type=str, required=True, help='Database user')
    parser.add_argument('--password', type=str, required=True, help='Database password')
    
    args = parser.parse_args()

    modify_tables(args.database, args.user, args.password, args.host)

if __name__ == "__main__":
    main()
