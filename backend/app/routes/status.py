from fastapi import APIRouter, HTTPException

from app.models.schemas import StatusResponse
from app.services.conversion_service import get_task

router = APIRouter(prefix="/status", tags=["Status"])


@router.get("/{task_id}", response_model=StatusResponse, summary="Get conversion status")
async def task_status(task_id: str):
    """
    Returns the current status of a conversion task.

    Possible statuses:
    - `pending`    – queued, not yet started
    - `processing` – conversion in progress
    - `completed`  – both ONNX and TFLite files are ready
    - `failed`     – conversion error (see `error` field)
    """
    task = get_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found.")

    return StatusResponse(
        task_id=task_id,
        status=task["status"],
        error=task.get("error"),
        outputs=task.get("outputs"),
    )
