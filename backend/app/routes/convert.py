import os
from fastapi import APIRouter, HTTPException

from app.models.schemas import ConvertRequest, ConvertResponse
from app.services.conversion_service import start_conversion

router = APIRouter(prefix="/convert", tags=["Convert"])


@router.post("", response_model=ConvertResponse, summary="Trigger model conversion")
async def convert_model(body: ConvertRequest):
    """
    Starts an asynchronous PyTorch → ONNX → TFLite conversion job.
    - **file_id**: The `file_id` string returned from `POST /upload`.
    Returns a `task_id` to track progress via `GET /status/{task_id}`.
    """
    pt_path = body.file_id   # file_id is the absolute path set in /upload
    if not os.path.isfile(pt_path):
        raise HTTPException(status_code=404, detail="File not found. Please upload the model first.")

    task_id = await start_conversion(
        file_id=pt_path, 
        pt_path=pt_path, 
        precision=body.precision
    )

    return ConvertResponse(
        task_id=task_id,
        file_id=pt_path,
        status="pending"
    )
