# Standard coding segments snippet

import pymysql.cursors
import json
from os import getenv


def lambda_handler(event, context):
    # Establish a new database connection for each invocation
    with pymysql.connect(
        host="dailycheckers-mysql.cpeg0mmogxkq.us-east-1.rds.amazonaws.com",
        user="trumpetbeast",
        password="2JDfC1YtMiKLa17cdscj",
        database="dailycheckers_invites",
        cursorclass=pymysql.cursors.DictCursor,
    ) as connection:
        authenticated_user = json.loads(event["requestContext"]["authorizer"]["user"])
        with connection.cursor() as cursor:
            cursor.execute(
                f"SELECT * FROM invites WHERE `to` = '{authenticated_user['id']}'"
            )
            invites = cursor.fetchall()

            if not invites:
                return response(200, {"invites": []})

            return response(200, {"invites": invites})


def response(code, body):
    return {
        "statusCode": code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
        "body": json.dumps(body),
        "isBase64Encoded": False,
    }
