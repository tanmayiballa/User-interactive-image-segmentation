import sys
import logging.handlers
from logging import StreamHandler

logger = logging.getLogger('Image Classification')
logger.setLevel('INFO')

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s  - %(filename)s - %(module)s: %(funcName)s: '
                              '%(lineno)d - %(message)s')

# Adding the log Console handler to the logger
console_handler = StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)
