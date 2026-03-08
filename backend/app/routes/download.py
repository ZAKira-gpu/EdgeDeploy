import os
import zipfile
from pathlib import Path
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from app.services.conversion_service import get_task, get_output_dir

router = APIRouter(prefix="/download", tags=["Download"])

_FORMAT_MAP = {
    "onnx":   "model.onnx",
    "tflite": "model.tflite",
    "all":    None,          # triggers zip creation
}


@router.get("/{task_id}", summary="Download converted model file(s)")
async def download(
    task_id: str,
    format: str = Query("all", enum=["onnx", "tflite", "all"],
                        description="Which output format to download."),
):
    """
    Download one or both converted model files once the task is **completed**.

    - `format=onnx`   — download the ONNX file
    - `format=tflite` — download the TFLite file
    - `format=all`    — download a zip containing both (default)
    """
    task = get_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found.")
    if task["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Task is '{task['status']}', not yet completed."
        )

    out_dir = get_output_dir(task_id)

    if format == "all":
        zip_path = out_dir / "converted_models.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for fname in ["model.onnx", "model.tflite"]:
                fpath = out_dir / fname
                if fpath.exists():
                    zf.write(fpath, fname)
        return FileResponse(
            path=str(zip_path),
            media_type="application/zip",
            filename="converted_models.zip",
        )

    filename = _FORMAT_MAP[format]
    file_path = out_dir / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"{filename} not found for this task.")

    media_types = {
        "onnx":   "application/octet-stream",
        "tflite": "application/octet-stream",
    }
    return FileResponse(
        path=str(file_path),
        media_type=media_types[format],
        filename=filename,
    )
