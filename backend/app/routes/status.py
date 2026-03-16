from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import StatusResponse
from app.services.conversion_service import get_task
from app.dependencies import get_current_user
from app.models.database_models import User as DBUser

router = APIRouter(prefix="/status", tags=["Status"])


@router.get("/{task_id}", response_model=StatusResponse, summary="Get conversion status")
async def task_status(
    task_id: str,
    current_user: DBUser = Depends(get_current_user)
):
    """
    Returns the current status of a conversion task.
    """
    task = get_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    # Ownership check
    if task["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this task")

    return StatusResponse(
        task_id=task_id,
        status=task["status"],
        error=task.get("error"),
        outputs=task.get("outputs"),
    )

