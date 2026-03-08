from pydantic import BaseModel
from typing import Optional

class UploadResponse(BaseModel):
    file_id: str
    filename: str
    message: str

class ConvertRequest(BaseModel):
    file_id: str

class ConvertResponse(BaseModel):
    task_id: str
    file_id: str
    status: str

class StatusResponse(BaseModel):
    task_id: str
    status: str         # "pending" | "processing" | "completed" | "failed"
    error: Optional[str] = None
    outputs: Optional[dict] = None

class ErrorResponse(BaseModel):
    detail: str
