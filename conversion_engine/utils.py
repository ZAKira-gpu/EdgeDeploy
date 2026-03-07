import os
import logging

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("conversion_engine")
