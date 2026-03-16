import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("worker")

def process_tasks():
    logger.info("Worker started, waiting for tasks...")
    while True:
        # Placeholder for task queue polling logic (e.g., Redis/RabbitMQ)
        time.sleep(10)

if __name__ == "__main__":
    process_tasks()
