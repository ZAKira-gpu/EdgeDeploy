from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UploadResponse(BaseModel):
    file_id: str
    filename: str
    message: str

class ConvertRequest(BaseModel):
    file_id: str
    precision: str = "fp32"  # "fp32", "fp16", or "int8"

class ConvertResponse(BaseModel):
    task_id: str
    file_id: str
    status: str

class StatusResponse(BaseModel):
    task_id: str
    status: str         # "pending" | "processing" | "completed" | "failed"
    precision: Optional[str] = "fp32"
    error: Optional[str] = None
    outputs: Optional[dict] = None
    created_at: Optional[datetime] = None

class TaskListResponse(BaseModel):
    tasks: List[StatusResponse]
    count: int
    limit: int = 3

class ErrorResponse(BaseModel):
    detail: str
