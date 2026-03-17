import os
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ConvertRequest, ConvertResponse
from app.services.conversion_service import start_conversion, count_user_tasks
from app.dependencies import get_current_user
from app.models.database_models import User as DBUser

CONVERSION_LIMIT = 3

router = APIRouter(prefix="/convert", tags=["Convert"])


@router.post("", response_model=ConvertResponse, summary="Trigger model conversion")
async def convert_model(
    body: ConvertRequest,
    current_user: DBUser = Depends(get_current_user)
):
    """
    Starts an asynchronous PyTorch → ONNX → TFLite conversion job.
    Limit: 3 conversions per user account.
    """
    # 1. Check conversion limit
    task_count = count_user_tasks(current_user.id)
    if task_count >= CONVERSION_LIMIT:
        raise HTTPException(
            status_code=403, 
            detail=f"Conversion limit reached ({CONVERSION_LIMIT} per account). Please contact support for more quota."
        )

    # 2. Check file existence
    pt_path = body.file_id
    if not os.path.isfile(pt_path):
        raise HTTPException(status_code=404, detail="File not found")

    # 3. Start conversion
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
