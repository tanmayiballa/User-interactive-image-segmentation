from fastapi import FastAPI

from mask_cnn_service import router


app = FastAPI()
app.include_router(router)


@app.get('/')
def root():
    return "Welcome to User Interactive Image Classification and Segmentation application"

