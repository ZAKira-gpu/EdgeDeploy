from fastapi import APIRouter, Depends
from app.models.schemas import TaskListResponse, StatusResponse
from app.services.conversion_service import get_user_history, count_user_tasks
from app.dependencies import get_current_user
from app.models.database_models import User as DBUser

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=TaskListResponse, summary="Get user conversion history")
async def list_tasks(current_user: DBUser = Depends(get_current_user)):
    """
    Returns a list of all conversion tasks created by the current user.
    """
    history = get_user_history(current_user.id)
    count = count_user_tasks(current_user.id)
    
    return TaskListResponse(
        tasks=[StatusResponse(**t) for t in history],
        count=count,
        limit=3
    )
