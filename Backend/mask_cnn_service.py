import shutil
from pathlib import Path
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse

import app_constants
from mask_cnn_handler import Handler
from logging_utility import logger

router = APIRouter()


@router.get(app_constants.test_api_endpoint)
def test():
    logger.info("Test service is hit")
    return "Test"


@router.post(app_constants.upload_file_endpoint)
async def create_upload_file(file: UploadFile = File(...)):
    try:
        obj = Handler()
        uploaded_file = file.file
        file_path = Path(f"uploads/{file.filename}")
        
        uploads_dir = Path("uploads")
        uploads_dir.mkdir(parents=True, exist_ok=True)

        file_path = uploads_dir / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(uploaded_file, buffer)

        out_file_ = obj.predict(file_path)
        output_path = Path(f"output/{out_file_}")

        response = app_constants.result_success_template(
            data=out_file_, message="Uploaded file Successfully")
        return response

    except HTTPException as err:
        return app_constants.result_error_template(message=err.detail)

    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err)) from err


@router.get(app_constants.download_file_endpoint)
async def download_file(file_name: str):
    try:
        file_path = Path(f"output/{file_name}")
        return FileResponse(file_path, media_type="application/octet-stream", filename=file_name)
    except HTTPException as err:
        return app_constants.result_error_template(message=err.detail)

    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
