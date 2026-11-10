## Aided with basic GitHub coding tools
"""
Script to purge RabbitMQ queues for testing purposes.

Usage:
    python purge_rabbitmq_queues.py

Requirements:
    - requests Python package
    - RabbitMQ management plugin enabled
"""
import requests
import sys

RABBITMQ_API = "http://localhost:15672/api/queues/%2F"
RABBITMQ_USER = "user"
RABBITMQ_PASS = "password"
QUEUES = ["task_queue", "response_queue", "reward_queue"]

def purge_queue(queue) :
    """
    Purge a RabbitMQ queue using the management HTTP API.
    Args:
        queue: The name of the queue to purge.
    Raises:
        RuntimeError: If the purge operation fails.
    """
    url = "{}{}/contents".format(RABBITMQ_API, queue)
    resp = requests.delete(url, auth=(RABBITMQ_USER, RABBITMQ_PASS))
    if resp.status_code not in (204, 200):
        raise RuntimeError("Failed to purge {}: {}".format(queue, resp.text))
    print("Purged queue: {}".format(queue))

def main() :
    """
    Main function to purge all specified RabbitMQ queues.
    """
    for queue in QUEUES:
        try:
            purge_queue(queue)
        except Exception as e:
            print("Error purging queue {}: {}".format(queue, e), file=sys.stderr)

if __name__ == "__main__":
    main()
## End of generated code
