# Code example for python using Django framework
# This code was Aided using common development resources from pseudo-code
# If you spot an issue, feel free to create a PR to fix it


import os
import re

import requests
from slack.errors import SlackApiError
from slack_sdk import WebClient


def _download_file(file_link):
    print("Downloading file:", file_link)
    response = requests.get(file_link)
    if response.status_code == 200:
        return response.content
    else:
        print("Error downloading file:", file_link)
        return None


def _rewrite_message(event, new_text):
    # Initialize Slack WebClient
    # TODO configure SLACK_API_TOKEN with your slack app token
    slack_token = os.environ["SLACK_API_TOKEN"]
    client = WebClient(token=slack_token)

    channel_id = event["channel"]
    message_ts = event["ts"]
    try:
        # Call the chat.update method to edit the message
        response = client.chat_update(channel=channel_id, ts=message_ts, text=new_text)
        if response["ok"]:
            print("Message updated successfully!")
        else:
            print(f"Failed to update message: {response['error']}")
    except SlackApiError as e:
        print(f"Error updating message: {e.response['error']}")


# This the main function of your flow, use it on your route which listens to Slack events API
def backup_files(request_data):
    event = request_data.get("event", {})
    event_type = request_data.get("type")
    # if the event is a new thread message written by Tiny Chat bot and it contains a Tiny Chat file link
    if (
        event_type == "message"
        and event.get("thread_ts")
        and event.get("bot_id")
        and "https://files.tiny-chat.com" in event.get("text")
    ):
        # retrieve the link from the text
        pattern = r"https://files\.tiny-chat\.com\S+\|"
        match = re.search(pattern, event["text"])
        if match:
            file_link = match.group()
            print("Found a Tiny Chat file link:", file_link)
            file_content = _download_file(file_link)
            if file_content:
                new_file_link = None
                # TODO upload the file to your own storage and returns the new file link
                # new_file_link = upload_to_storage(file_content)
                new_text = re.sub(pattern, new_file_link, event["text"])
                _rewrite_message(event, new_text)
