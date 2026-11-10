## Aided with basic GitHub coding tools
"""
Orchestrator CLI for testing agentic workflow communication.
Sends a test task to the small model agent, waits for response and reward, and prints results.
"""
import argparse
import json
import os
import sys
import time
import uuid
from typing import Any, Dict, NoReturn
import pika
import threading
from fastapi import FastAPI, HTTPException
import uvicorn

TASK_QUEUE = 'task_queue'
RESPONSE_QUEUE = 'response_queue'
REWARD_QUEUE = 'reward_queue'

RABBITMQ_HOST = os.environ.get('RABBITMQ_HOST', 'rabbitmq')  # Use 'rabbitmq' for Docker
RABBITMQ_USER = os.environ.get('RABBITMQ_USER', 'user')
RABBITMQ_PASS = os.environ.get('RABBITMQ_PASS', 'password')
LOG_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs", "agent_interactions.jsonl")


def log_event(event: Dict[str, Any]) -> None:
    """
    Append a structured event to the orchestrator log file as JSONL.
    Log schema (one JSON object per line):
        {
            "event": str,  # e.g., 'task_sent', 'response_received', 'reward_received', 'error'
            "timestamp": str,  # ISO8601 UTC
            "task_id": str,
            "input": str,  # Only for 'task_sent'
            "response": str,  # Only for 'response_received'
            "reward": float,  # Only for 'reward_received'
            "error": str,  # Only for 'error'
            "source": str,  # 'persistent_orchestrator', 'cli', etc.
            "metadata": dict  # Optional, extensible
        }
    Args:
        event: The event dictionary to log.
    Raises:
        OSError: If the log file cannot be written.
    Usage:
        log_event({"event": "task_sent", ...})
    """
    try:
        os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
        with open(LOG_FILE, "a") as f:
            f.write(json.dumps(event) + "\n")
    except Exception as e:
        print(f"[Orchestrator][LOGGING ERROR] {e}", file=sys.stderr)


def send_task_and_get_result(task_input: str, timeout: float = 10.0) -> None:
    """
    Send a test task to the small model agent and print the response and reward.
    Args:
        task_input: The input string for the task.
        timeout: How long to wait for responses (seconds).
    Raises:
        RuntimeError: If no response or reward is received in time.
    """
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials))
    channel = connection.channel()
    # Ensure queues exist
    channel.queue_declare(queue=TASK_QUEUE, durable=True)
    channel.queue_declare(queue=RESPONSE_QUEUE, durable=True)
    channel.queue_declare(queue=REWARD_QUEUE, durable=True)

    task_id = f"test-{int(time.time())}"
    task_msg = {
        "task_id": task_id,
        "input": task_input,
        "metadata": {"timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ'), "source": "cli"}
    }
    channel.basic_publish(
        exchange='', routing_key=TASK_QUEUE, body=json.dumps(task_msg),
        properties=pika.BasicProperties(delivery_mode=2)
    )
    print(f"[Orchestrator] Sent task: {task_msg}")
    log_event({
        "event": "task_sent",
        "task_id": task_id,
        "input": task_input,
        "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
        "source": "cli",
        "metadata": task_msg.get("metadata", {})
    })

    response = None
    reward = None
    start = time.time()
    # Wait for response
    while time.time() - start < timeout:
        method, props, body = channel.basic_get(RESPONSE_QUEUE, auto_ack=True)
        if body:
            msg = json.loads(body)
            if msg.get('task_id') == task_id:
                response = msg
                print(f"[Orchestrator] Got response: {response}")
                break
        time.sleep(0.2)
    if not response:
        log_event({
            "event": "error",
            "type": "no_response",
            "task_id": task_id,
            "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
            "source": "cli"
        })
        raise RuntimeError("No response received from small model agent.")
    log_event({
        "event": "response_received",
        "task_id": task_id,
        "response": response.get("response", str(response)),
        "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
        "source": "cli",
        "metadata": response.get("metadata", {})
    })

    # Wait for reward
    start = time.time()
    while time.time() - start < timeout:
        method, props, body = channel.basic_get(REWARD_QUEUE, auto_ack=True)
        if body:
            msg = json.loads(body)
            if msg.get('task_id') == task_id:
                reward = msg
                print(f"[Orchestrator] Got reward: {reward}")
                break
        time.sleep(0.2)
    if not reward:
        log_event({
            "event": "error",
            "type": "no_reward",
            "task_id": task_id,
            "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
            "source": "cli"
        })
        raise RuntimeError("No reward received from scoring agent.")
    log_event({
        "event": "reward_received",
        "task_id": task_id,
        "reward": reward.get("score", reward),
        "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
        "source": "cli",
        "metadata": reward.get("metadata", {})
    })
    print("[Orchestrator] Test complete.")
    connection.close()


def on_response_message(ch, method, properties, body):
    """
    Callback for processing messages from the RESPONSE_QUEUE.
    Args:
        ch: The channel object.
        method: Delivery method.
        properties: Message properties.
        body: The message body.
    """
    try:
        msg = json.loads(body)
        print(f"[Orchestrator] Received response: {msg}")
        log_event({
            "event": "response_received",
            "task_id": msg.get("task_id"),
            "response": msg.get("response", str(msg)),
            "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
            "source": "persistent_orchestrator",
            "metadata": msg.get("metadata", {})
        })
    except Exception as e:
        print(f"[Orchestrator][ERROR] Failed to process response: {e}")
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)


def on_reward_message(ch, method, properties, body):
    """
    Callback for processing messages from the REWARD_QUEUE.
    Args:
        ch: The channel object.
        method: Delivery method.
        properties: Message properties.
        body: The message body.
    """
    try:
        msg = json.loads(body)
        print(f"[Orchestrator] Received reward: {msg}")
        log_event({
            "event": "reward_received",
            "task_id": msg.get("task_id"),
            "reward": msg.get("score", msg),
            "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
            "source": "persistent_orchestrator",
            "metadata": msg.get("metadata", {})
        })
    except Exception as e:
        print(f"[Orchestrator][ERROR] Failed to process reward: {e}")
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)


def persistent_task_sender() -> NoReturn:
    """
    Continuously sends a dummy task message to the small model agent every 10 seconds.
    Also consumes messages from RESPONSE_QUEUE and REWARD_QUEUE.
    """
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    while True:
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials)
            )
            channel = connection.channel()
            channel.queue_declare(queue=TASK_QUEUE, durable=True)
            channel.queue_declare(queue=RESPONSE_QUEUE, durable=True)
            channel.queue_declare(queue=REWARD_QUEUE, durable=True)

            # Start consuming messages
            channel.basic_consume(queue=RESPONSE_QUEUE, on_message_callback=on_response_message)
            channel.basic_consume(queue=REWARD_QUEUE, on_message_callback=on_reward_message)

            print("[Orchestrator] Waiting for messages...")
            channel.start_consuming()
        except pika.exceptions.AMQPConnectionError as e:
            print(f"[Orchestrator][ERROR] RabbitMQ connection error: {e}. Retrying in 5 seconds...")
            time.sleep(5)
        except Exception as e:
            print(f"[Orchestrator][ERROR] Unexpected error: {e}. Retrying in 5 seconds...")
            time.sleep(5)


def main() -> None:
    """
    CLI entry point for orchestrator testing or persistent mode.
    """
    parser = argparse.ArgumentParser(description="Orchestrator CLI")
    parser.add_argument(
        "--persistent",
        action="store_true",
        help="Run the orchestrator in persistent mode (sends dummy tasks every 10 seconds)."
    )
    args = parser.parse_args()

    if args.persistent:
        print("[Orchestrator] Running in persistent mode.")
        persistent_task_sender()
    else:
        print("[Orchestrator] Running in CLI mode.")
        # Add CLI-specific logic here if needed


if __name__ == "__main__":
    main()
