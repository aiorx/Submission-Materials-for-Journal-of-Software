## Assisted using common GitHub development utilities
"""
Scoring Agent: Listens for responses on RabbitMQ, generates a mock reward, and sends it to the reward queue.
Includes robust connection retry and startup logging.
"""
import json
import os
import time
import threading
from fastapi import FastAPI, HTTPException
import uvicorn
from typing import Any, Dict
import pika
import logging

RESPONSE_QUEUE = 'response_queue'
REWARD_QUEUE = 'reward_queue'

RABBITMQ_HOST = os.environ.get('RABBITMQ_HOST', 'rabbitmq')  # Use 'rabbitmq' for Docker
RABBITMQ_USER = os.environ.get('RABBITMQ_USER', 'user')
RABBITMQ_PASS = os.environ.get('RABBITMQ_PASS', 'password')
SCORING_AGENT_ID = 'scoring_agent_1'

app = FastAPI(title="Scoring Agent MCP Server")

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
    return {"agent_id": SCORING_AGENT_ID, "status": "running"}

@app.get("/metrics")
def metrics() -> Dict[str, Any]:
    """
    Metrics endpoint for the MCP server.
    Returns:
        A dict with basic metrics (placeholder).
    """
    return {"responses_scored": 0, "rewards_sent": 0}

def connect_with_retry(max_retries: int = 10, delay: float = 2.0) -> pika.BlockingConnection:
    """
    Attempt to connect to RabbitMQ with retries.
    Raises RuntimeError if connection fails after max_retries.
    """
    for attempt in range(1, max_retries + 1):
        try:
            print(f"[ScoringAgent] Connecting to RabbitMQ (attempt {attempt})...")
            credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials))
            print("[ScoringAgent] Connected to RabbitMQ.")
            return connection
        except Exception as e:
            print(f"[ScoringAgent] Connection failed: {e}")
            time.sleep(delay)
    raise RuntimeError("[ScoringAgent] Could not connect to RabbitMQ after retries.")

def main() -> None:
    """
    Main loop for the scoring agent. Listens for responses and sends mock rewards.
    """
    try:
        connection = connect_with_retry()
        channel = connection.channel()
        channel.queue_declare(queue=RESPONSE_QUEUE, durable=True)
        channel.queue_declare(queue=REWARD_QUEUE, durable=True)
        print("[ScoringAgent] Waiting for responses...")
        def callback(ch, method, properties, body):
            """
            Callback for response messages. Publishes reward to REWARD_QUEUE.
            """
            try:
                response = json.loads(body)
                assert "task_id" in response, "Response message missing task_id."
                logging.info(f"[Scoring Agent] Received response: {response}")

                reward = {
                    "task_id": response["task_id"],
                    "score": 1.0,  # Mock score for testing
                    "metadata": {"timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ')}
                }
                ch.basic_publish(
                    exchange='',
                    routing_key=REWARD_QUEUE,
                    body=json.dumps(reward).encode('utf-8')
                )
                logging.info(f"[Scoring Agent] Sent reward: {reward}")
            except Exception as e:
                logging.error(f"[Scoring Agent][ERROR] Failed to process response: {e}")
            finally:
                ch.basic_ack(delivery_tag=method.delivery_tag)
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue=RESPONSE_QUEUE, on_message_callback=callback)
        channel.start_consuming()
    except Exception as e:
        print(f"[ScoringAgent] Fatal error: {e}")
        time.sleep(5)
        raise

def start_rabbitmq_loop() -> None:
    """
    Starts the RabbitMQ consumer loop in a background thread.
    """
    try:
        main()
    except Exception as e:
        print(f"RabbitMQ loop crashed: {e}")

if __name__ == "__main__":
    # Start RabbitMQ consumer in a background thread
    rabbitmq_thread = threading.Thread(target=start_rabbitmq_loop, daemon=True)
    rabbitmq_thread.start()
    # Start FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8000)
## End of generated code
