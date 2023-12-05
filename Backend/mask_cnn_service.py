from fastapi import APIRouter
import app_constants
from logging_utility import logger

router = APIRouter()


@router.get(app_constants.test_api_endpoint)
def test():
    logger.info("Test service is hit")
    return "Test"

