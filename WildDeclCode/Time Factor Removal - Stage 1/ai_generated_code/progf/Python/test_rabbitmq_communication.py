## Aided with basic GitHub coding tools
import os
import sys
import socket

def is_orchestrator_running() :
    """
    Check if the orchestrator container is running by attempting to connect to the default FastAPI port.
    Returns True if running, False otherwise.
    """
    try:
        sock = socket.create_connection(("localhost", 8000), timeout=1)
        sock.close()
        return True
    except Exception:
        return False

if is_orchestrator_running():
    print("[WARNING] Persistent orchestrator appears to be running. For isolated tests and correct logging, run 'python isolated_rabbitmq_test.py' instead.", file=sys.stderr)

"""
test_rabbitmq_communication.py

A script to test RabbitMQ communication for the agentic workflow project.
- Publishes a test task message to the Task Queue.
- Listens for a response on the Response Queue.
- Listens for a reward on the Reward Queue.

Requirements:
- RabbitMQ running and accessible
- pika Python package installed

Usage:
    python test_rabbitmq_communication.py

Author: Copilot
Date: 2025-04-20
"""
import json
import time
import uuid
from typing import Any, Dict, Optional
import pika
import sys
import os  # Ensure os is imported at the top for environment variable access

"""
Determine the appropriate RabbitMQ host based on environment.
- If RABBITMQ_HOST is set, use it.
- If running inside Docker (/.dockerenv exists), use 'rabbitmq'.
- Otherwise, default to 'localhost'.
"""
def get_rabbitmq_host() :
    # Priority: explicit env var > Docker > localhost
    env_host = os.getenv('RABBITMQ_HOST')
    if env_host:
        return env_host
    if os.path.exists('/.dockerenv'):
        return 'rabbitmq'
    return 'localhost'

# Use the new function to set RABBITMQ_HOST
RABBITMQ_HOST = get_rabbitmq_host()
RABBITMQ_PORT = int(os.getenv('RABBITMQ_PORT', '5672'))
RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'user')
RABBITMQ_PASS = os.getenv('RABBITMQ_PASS', 'password')

# Use the correct queue names as in the main services
TASK_QUEUE = 'task_queue'
RESPONSE_QUEUE = 'response_queue'
REWARD_QUEUE = 'reward_queue'


def print_verbose(msg) :
    """
    Print a verbose message to stdout.
    Args:
        msg: The message to print.
    """
    print("[Copilot][DEBUG] {}".format(msg))


def get_connection() :
    """
    Establish a connection to RabbitMQ using credentials from environment.
    Returns:
        pika.BlockingConnection: The connection object.
    Raises:
        pika.exceptions.AMQPConnectionError: If connection fails.
    """
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    params = pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT, credentials=credentials)
    return pika.BlockingConnection(params)


def publish_task_message(task_id, input_text) :
    """
    Publish a test task message to the Task Queue.
    Args:
        task_id: Unique identifier for the task.
        input_text: The input prompt or data for the agent.
    Raises:
        pika.exceptions.AMQPError: If publishing fails.
    """
    message = {
        "task_id": task_id,
        "input": input_text,
        "metadata": {
            "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            "source": "test_script"
        }
    }
    try:
        connection = get_connection()
        channel = connection.channel()
        channel.queue_declare(queue=TASK_QUEUE, durable=True)
        channel.basic_publish(
            exchange='',
            routing_key=TASK_QUEUE,
            body=json.dumps(message),
            properties=pika.BasicProperties(delivery_mode=2)
        )
        print_verbose("Sent task message: {}".format(message))
        connection.close()
    except pika.exceptions.AMQPConnectionError as e:
        print("[Copilot][ERROR] Could not connect to RabbitMQ: {}".format(e))
        sys.exit(1)
    except Exception as e:
        print("[Copilot][ERROR] Unexpected error in publish_task_message: {}".format(e))
        sys.exit(1)


def consume_message(queue, filter_task_id, timeout = 120) :
    """
    Consume a message from a queue, filtering by task_id, using a blocking consumer.
    Prints all messages seen for debugging.
    Args:
        queue: The queue name to consume from.
        filter_task_id: The task_id to filter for.
        timeout: Timeout in seconds to wait for a message.
    Returns:
        The message dict if found, else None.
    Raises:
        pika.exceptions.AMQPError: If connection fails.
    """
    result = None
    try:
        connection = get_connection()
        channel = connection.channel()
        channel.queue_declare(queue=queue, durable=True)
        start_time = time.time()
        def callback(ch, method, properties, body):
            nonlocal result
            try:
                message = json.loads(body)
                assert isinstance(message, dict), "Message is not a dict"
                print_verbose("[DEBUG] Saw message in {}: {}".format(queue, message))
                if message.get("task_id") == filter_task_id:
                    print_verbose("[DEBUG] Matched task_id: {}".format(filter_task_id))
                    result = message
                    ch.basic_ack(delivery_tag=method.delivery_tag)
                    channel.stop_consuming()
                else:
                    print_verbose("[DEBUG] Skipped unrelated message in {}: {}".format(queue, message))
                    ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as e:
                print("[Copilot][ERROR] Error decoding message from {}: {}".format(queue, e))
                ch.basic_ack(delivery_tag=method.delivery_tag)
        channel.basic_consume(queue=queue, on_message_callback=callback, auto_ack=False)
        while result is None and (time.time() - start_time < timeout):
            channel.connection.process_data_events(time_limit=1)
        if result is None:
            print("[Copilot][WARN] No message received from {} for task_id {} within timeout.".format(queue, filter_task_id))
        connection.close()
        return result
    except pika.exceptions.AMQPConnectionError as e:
        print("[Copilot][ERROR] Could not connect to RabbitMQ: {}".format(e))
        sys.exit(1)
    except Exception as e:
        print("[Copilot][ERROR] Unexpected error in consume_message: {}".format(e))
        sys.exit(1)


def main() :
    """
    Main function to test RabbitMQ communication.
    Steps:
    1. Publish a test task message.
    2. Wait for a response message.
    3. Wait for a reward message.
    """
    task_id = str(uuid.uuid4())
    input_text = "What is the capital of France?"
    try:
        print_verbose("Publishing test task message...")
        publish_task_message(task_id, input_text)
        # Add a short delay to ensure the message is available in the queue before consuming
        time.sleep(2)
        print("[Copilot] Waiting for response message...")
        response = consume_message(RESPONSE_QUEUE, task_id)
        assert response is not None, "No response message received. Check if small_model_agent is running and connected."
        print("[Copilot] Waiting for reward message...")
        reward = consume_message(REWARD_QUEUE, task_id)
        assert reward is not None, "No reward message received. Check if scoring_agent is running and connected."
        print("[Copilot][SUCCESS] Communication test successful.")
    except AssertionError as ae:
        print("[Copilot][FAIL] Assertion failed: {}".format(ae))
        sys.exit(2)
    except Exception as e:
        print("[Copilot][ERROR] Unexpected error in main: {}".format(e))
        sys.exit(1)


if __name__ == "__main__":
    main()
## End of generated code
