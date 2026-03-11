import uuid
import aiofiles
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.models.schemas import UploadResponse

UPLOAD_DIR = Path(__file__).resolve().parents[3] / "storage" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

CHUNK_SIZE = 1024 * 1024  # 1 MB chunks

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

    # Write in async chunks so large models don't block the event loop
    async with aiofiles.open(dest, "wb") as out:
        while chunk := await file.read(CHUNK_SIZE):
            await out.write(chunk)

    return UploadResponse(
        file_id=str(dest),
        filename=file.filename,
        message="File uploaded successfully. Use /convert to start conversion."
    )
