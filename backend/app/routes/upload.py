import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.models.schemas import UploadResponse

UPLOAD_DIR = Path(__file__).resolve().parents[3] / "storage" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("", response_model=UploadResponse, summary="Upload a .pt model file")
async def upload_model(file: UploadFile = File(...)):
    """
    Upload a PyTorch `.pt` model file.
    Returns a `file_id` to reference this upload in the /convert endpoint.
    """
    if not file.filename.endswith(".pt"):
        raise HTTPException(status_code=400, detail="Only .pt files are accepted.")

    file_id = str(uuid.uuid4())
    dest = UPLOAD_DIR / f"{file_id}_{file.filename}"

    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return UploadResponse(
        file_id=str(dest),          # use path as stable reference
        filename=file.filename,
        message="File uploaded successfully. Use /convert to start conversion."
    )
