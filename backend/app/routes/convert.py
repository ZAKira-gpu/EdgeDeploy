import os
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ConvertRequest, ConvertResponse
from app.services.conversion_service import start_conversion
from app.dependencies import get_current_user
from app.models.database_models import User as DBUser

router = APIRouter(prefix="/convert", tags=["Convert"])


@router.post("", response_model=ConvertResponse, summary="Trigger model conversion")
async def convert_model(
    body: ConvertRequest,
    current_user: DBUser = Depends(get_current_user)
):
    """
    Starts an asynchronous PyTorch → ONNX → TFLite conversion job.
    - **file_id**: The `file_id` string returned from `POST /upload`.
    Returns a `task_id` to track progress via `GET /status/{task_id}`.
    """
    pt_path = body.file_id   # file_id is the absolute path set in /upload
    if not os.path.isfile(pt_path):
        raise HTTPException(status_code=404, detail="File not found")

    task_id = await start_conversion(
        file_id=pt_path, 
        pt_path=pt_path, 
        user_id=current_user.id,
        precision=body.precision
    )

    return ConvertResponse(
        task_id=task_id,
        file_id=pt_path,
        status="pending"
    )
