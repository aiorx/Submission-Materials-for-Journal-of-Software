## Supported via standard GitHub programming aids
"""
Small Model Agent MCP Server

This minimal MCP server listens for tasks on RabbitMQ, generates a simple response (echo or rule-based), and publishes the response. It also listens for reward messages and logs them. This is for end-to-end workflow testing before integrating a real LLM.

Usage:
    python main.py

Environment Variables:
    RABBITMQ_HOST: RabbitMQ server hostname
    TASK_QUEUE: Name of the task queue
    RESPONSE_QUEUE: Name of the response queue
    REWARD_QUEUE: Name of the reward queue
    AGENT_ID: Unique identifier for this agent

Exceptions:
    Raises ConnectionError if RabbitMQ is unreachable.
    Handles and logs all message processing errors.
"""
import os
import json
import time
import logging
import pika
import threading
from fastapi import FastAPI, HTTPException
import uvicorn
from typing import Any, Dict, Optional

# Setup logging
logging.basicConfig(level=logging.INFO)

# Environment variables and defaults
def get_env_var(name: str, default: str) -> str:
    value = os.getenv(name, default)
    assert value, f"Environment variable {name} must be set."
    return value

RABBITMQ_HOST = get_env_var("RABBITMQ_HOST", "rabbitmq")
TASK_QUEUE = get_env_var("TASK_QUEUE", "task_queue")
RESPONSE_QUEUE = get_env_var("RESPONSE_QUEUE", "response_queue")
REWARD_QUEUE = get_env_var("REWARD_QUEUE", "reward_queue")
AGENT_ID = get_env_var("AGENT_ID", "small_model_agent_1")


def connect_rabbitmq() -> pika.BlockingConnection:
    """
    Establish a connection to RabbitMQ using credentials from environment variables.
    Raises ConnectionError if connection fails.
    """
    try:
        rabbitmq_user = os.getenv("RABBITMQ_USER", "user")
        rabbitmq_pass = os.getenv("RABBITMQ_PASS", "password")
        credentials = pika.PlainCredentials(rabbitmq_user, rabbitmq_pass)
        params = pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials)
        connection = pika.BlockingConnection(params)
        return connection
    except Exception as e:
        logging.error(f"Failed to connect to RabbitMQ: {e}")
        raise ConnectionError("Could not connect to RabbitMQ")

def process_task_message(body: bytes) -> Dict[str, Any]:
    """
    Process a task message and generate a response.
    Args:
        body: The raw message body from RabbitMQ.
    Returns:
        A response message dict.
    Raises:
        ValueError: If the message is invalid.
    """
    try:
        task = json.loads(body)
        assert "task_id" in task and "input" in task, "Invalid task message format."
        response = {
            "task_id": task["task_id"],
            "response": f"Echo: {task['input']}",
            "agent_id": AGENT_ID,
            "metadata": {"timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
        }
        return response
    except Exception as e:
        logging.error(f"Error processing task message: {e}")
        raise ValueError("Invalid task message")

def on_task_message(ch, method, properties, body):
    """
    Callback for task messages. Publishes response to RESPONSE_QUEUE.
    """
    try:
        task = json.loads(body)
        assert "task_id" in task, "Task message missing task_id."
        logging.info(f"[Small Model Agent] Received task: {task}")

        response = {
            "task_id": task["task_id"],
            "response": f"Processed: {task['input']}",
            "metadata": {"timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ')}
        }
        ch.basic_publish(
            exchange='',
            routing_key=RESPONSE_QUEUE,
            body=json.dumps(response).encode('utf-8')
        )
        logging.info(f"[Small Model Agent] Sent response: {response}")
    except Exception as e:
        logging.error(f"[Small Model Agent][ERROR] Failed to process task: {e}")
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)

def on_reward_message(ch, method, properties, body):
    """
    Callback for reward messages. Logs the reward.
    """
    try:
        reward = json.loads(body)
        assert "task_id" in reward, "Reward message missing task_id."
        logging.info(f"[Small Model Agent] Received reward: {reward}")
    except Exception as e:
        logging.error(f"[Small Model Agent][ERROR] Failed to process reward: {e}")
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)

def main() -> None:
    """
    Main loop: connects to RabbitMQ, consumes tasks and rewards.
    """
    connection = connect_rabbitmq()
    channel = connection.channel()
    channel.queue_declare(queue=TASK_QUEUE, durable=True)
    channel.queue_declare(queue=RESPONSE_QUEUE, durable=True)
    channel.queue_declare(queue=REWARD_QUEUE, durable=True)

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=TASK_QUEUE, on_message_callback=on_task_message)
    channel.basic_consume(queue=REWARD_QUEUE, on_message_callback=on_reward_message)

    logging.info(f"[SMALL MODEL AGENT] Waiting for tasks and rewards. Agent ID: {AGENT_ID}")
    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        logging.info("Shutting down agent.")
    except Exception as e:
        logging.error(f"Agent crashed: {e}")
    finally:
        connection.close()

app = FastAPI(title="Small Model Agent MCP Server")

@app.get("/health")
def health() -> Dict[str, str]:
    """
    Health check endpoint for the MCP server.
    Returns:
        A dict indicating server health.
    """
    return {"status": "ok"}

@app.get("/status")
def status() -> Dict[str, Any]:
    """
    Status endpoint for the MCP server.
    Returns:
        A dict with agent status and ID.
    """
    return {"agent_id": AGENT_ID, "status": "running"}

@app.get("/metrics")
def metrics() -> Dict[str, Any]:
    """
    Metrics endpoint for the MCP server.
    Returns:
        A dict with basic metrics (placeholder).
    """
    return {"tasks_processed": 0, "rewards_received": 0}

def start_rabbitmq_loop() -> None:
    """
    Starts the RabbitMQ consumer loop in a background thread.
    """
    try:
        main()
    except Exception as e:
        logging.error(f"RabbitMQ loop crashed: {e}")

if __name__ == "__main__":
    # Start RabbitMQ consumer in a background thread
    rabbitmq_thread = threading.Thread(target=start_rabbitmq_loop, daemon=True)
    rabbitmq_thread.start()
    # Start FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8000)
## End of generated code
