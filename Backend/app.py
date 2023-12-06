import uvicorn
from fastapi import FastAPI

from mask_cnn_service import router
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="output_images/"), name="images")



@app.get('/')
def root():
    return "Welcome to User Interactive Image Classification and Segmentation application"


if __name__ == "__main__":
    uvicorn.run(app, host = "0:0:0:0", port = 5678)
    