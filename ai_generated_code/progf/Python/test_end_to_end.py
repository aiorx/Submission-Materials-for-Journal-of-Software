## Assisted using common GitHub development utilities
"""
End-to-End Test Script for Agentic Workflow

This script validates the communication between the orchestrator, small model agent, and scoring agent.

Usage:
    python test_end_to_end.py

Requirements:
    - RabbitMQ running and accessible
    - All agents (orchestrator, small model agent, scoring agent) running
"""
import json
import time
import uuid
from typing import Any, Dict, Optional
import pika

RABBITMQ_HOST = "rabbitmq"
RABBITMQ_USER = "user"
RABBITMQ_PASS = "password"
TASK_QUEUE = "task_queue"
RESPONSE_QUEUE = "response_queue"
REWARD_QUEUE = "reward_queue"

def publish_task(task_id: str, input_text: str) -> None:
    """
    Publish a task to the TASK_QUEUE.
    """
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS))
    )
    channel = connection.channel()
    channel.queue_declare(queue=TASK_QUEUE, durable=True)
    task = {
        "task_id": task_id,
        "input": input_text,
        "metadata": {"timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ')}
    }
    channel.basic_publish(
        exchange='',
        routing_key=TASK_QUEUE,
        body=json.dumps(task).encode('utf-8'),
        properties=pika.BasicProperties(delivery_mode=2)
    )
    print(f"[Test] Published task: {task}")
    connection.close()

def consume_message(queue: str, task_id: str, timeout: int = 10) -> Optional[Dict[str, Any]]:
    """
    Consume a message from a queue, filtering by task_id.
    """
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS))
    )
    channel = connection.channel()
    channel.queue_declare(queue=queue, durable=True)

    start_time = time.time()
    while time.time() - start_time < timeout:
        method, properties, body = channel.basic_get(queue, auto_ack=True)
        if body:
            message = json.loads(body)
            if message.get("task_id") == task_id:
                print(f"[Test] Received message from {queue}: {message}")
                connection.close()
                return message
    connection.close()
    print(f"[Test] No message received from {queue} for task_id {task_id} within timeout.")
    return None

def main() -> None:
    """
    Main function to run the end-to-end test.
    """
    task_id = str(uuid.uuid4())
    input_text = "Test input for end-to-end validation."

    # Publish a task
    publish_task(task_id, input_text)

    # Wait for a response
    response = consume_message(RESPONSE_QUEUE, task_id)
    assert response, "No response received. Check small model agent."

    # Wait for a reward
    reward = consume_message(REWARD_QUEUE, task_id)
    assert reward, "No reward received. Check scoring agent."

    print("[Test] End-to-end test completed successfully.")

if __name__ == "__main__":
    main()
## End of generated code
