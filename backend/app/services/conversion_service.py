"""
Conversion service — runs the conversion engine in a thread pool so FastAPI
stays non-blocking, and persists task state in a simple in-memory dict.
"""
import sys
import os
import uuid
import shutil
import asyncio
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

# ─── Path resolution — works locally AND inside Docker ────────────────────────
# Locally:  __file__ = .../EdgeDeploy/backend/app/services/conversion_service.py
#           parents[3] = .../EdgeDeploy  (repo root)
# Docker:   __file__ = /app/backend/app/services/conversion_service.py
#           parents[3] = /app  (also the root, since COPY puts code under /app)
_THIS_FILE = Path(__file__).resolve()
REPO_ROOT = _THIS_FILE.parents[3]
CONV_DIR = REPO_ROOT / "conversion_engine"

# Fallback: in Docker the PYTHONPATH=/app is set, so try /app/conversion_engine
if not CONV_DIR.exists():
    CONV_DIR = Path("/app/conversion_engine")

if str(CONV_DIR) not in sys.path:
    sys.path.insert(0, str(CONV_DIR))

from convert import convert_model  # noqa: E402 (added after path setup)

from app.database import SessionLocal
from app.models.database_models import Task as DBTask

# ─── Storage dirs ──────────────────────────────────────────────────────────
# In Docker, REPO_ROOT is /app — storage lives at /app/storage (volume-mounted)
STORAGE_ROOT = REPO_ROOT / "storage"
UPLOAD_DIR   = STORAGE_ROOT / "uploads"
OUTPUT_DIR   = STORAGE_ROOT / "outputs"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

_executor = ThreadPoolExecutor(max_workers=4)


# ─── Helpers ──────────────────────────────────────────────────────────────
def _run_conversion(task_id: str, pt_path: str, precision: str = "fp32"):
    """Synchronous conversion wrapper executed inside a thread."""
    db = SessionLocal()
    try:
        task = db.query(DBTask).filter(DBTask.id == task_id).first()
        if not task:
            return

        task.status = "processing"
        db.commit()

        print(f"\n[ENGINE] 🟡 Task {task_id}: Starting conversion for {pt_path}...")
        
        work_dir = str(OUTPUT_DIR / task_id)
        os.makedirs(work_dir, exist_ok=True)

        # Copy the uploaded .pt into the work dir
        dest_pt = os.path.join(work_dir, os.path.basename(pt_path))
        shutil.copy2(pt_path, dest_pt)

        print(f"[ENGINE] 🔄 Task {task_id}: Running PyTorch -> ONNX -> TFLite...")
        outputs = convert_model(dest_pt, work_dir, precision=precision)

        task.status = "completed"
        task.outputs = outputs
        db.commit()
        print(f"[ENGINE] ✅ Task {task_id}: Completed successfully!")
    except Exception as exc:
        task.status = "failed"
        task.error = str(exc)
        db.commit()
        print(f"[ENGINE] ❌ Task {task_id}: FAILED!")
        print(f"         Error: {exc}\n")
    finally:
        db.close()


async def start_conversion(file_id: str, pt_path: str, user_id: str, precision: str = "fp32") -> str:
    """Enqueue a conversion task, save to DB, and return its task_id."""
    task_id = str(uuid.uuid4())
    
    db = SessionLocal()
    try:
        new_task = DBTask(
            id=task_id,
            user_id=user_id,
            file_id=file_id,
            precision=precision,
            status="pending"
        )
        db.add(new_task)
        db.commit()
    finally:
        db.close()

    loop = asyncio.get_running_loop()
    loop.run_in_executor(_executor, _run_conversion, task_id, pt_path, precision)
    return task_id


def get_task(task_id: str) -> DBTask | None:
    db = SessionLocal()
    try:
        # Use eager loading or just detach if needed, but here we just return the object
        # and hope the caller doesn't need a session. Actually, better return a dict or copy.
        task = db.query(DBTask).filter(DBTask.id == task_id).first()
        if not task: return None
        return {
            "task_id": task.id,
            "status": task.status,
            "error": task.error,
            "outputs": task.outputs,
            "user_id": task.user_id
        }
    finally:
        db.close()



def get_output_dir(task_id: str) -> Path:
    return OUTPUT_DIR / task_id
