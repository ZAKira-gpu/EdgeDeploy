import zipfile
from pathlib import Path
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from app.services.conversion_service import get_task, get_output_dir

router = APIRouter(prefix="/download", tags=["Download"])


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

    outputs = task.get("outputs", {})
    onnx_path   = Path(outputs.get("onnx",   ""))
    tflite_path = Path(outputs.get("tflite", ""))

    if format == "all":
        out_dir  = get_output_dir(task_id)
        zip_path = out_dir / "converted_models.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            if onnx_path.exists():
                zf.write(onnx_path, onnx_path.name)
            if tflite_path.exists():
                zf.write(tflite_path, tflite_path.name)
        if zip_path.stat().st_size == 0:
            raise HTTPException(status_code=500, detail="Zip is empty — output files not found.")
        return FileResponse(
            path=str(zip_path),
            media_type="application/zip",
            filename="converted_models.zip",
        )

    if format == "onnx":
        if not onnx_path.exists():
            raise HTTPException(status_code=404, detail="ONNX file not found for this task.")
        return FileResponse(
            path=str(onnx_path),
            media_type="application/octet-stream",
            filename=onnx_path.name,
            headers={"Access-Control-Expose-Headers": "Content-Disposition"}
        )

    if format == "tflite":
        if not tflite_path.exists():
            raise HTTPException(status_code=404, detail="TFLite file not found for this task.")
        return FileResponse(
            path=str(tflite_path),
            media_type="application/octet-stream",
            filename=tflite_path.name,
            headers={"Access-Control-Expose-Headers": "Content-Disposition"}
        )
