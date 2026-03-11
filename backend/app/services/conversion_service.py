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

# Allow imports from the conversion_engine package regardless of cwd
REPO_ROOT = Path(__file__).resolve().parents[3]
CONV_DIR = REPO_ROOT / "conversion_engine"
if str(CONV_DIR) not in sys.path:
    sys.path.insert(0, str(CONV_DIR))

from convert import convert_model  # noqa: E402 (added after path setup)

# ─── Storage dirs ──────────────────────────────────────────────────────────
UPLOAD_DIR   = REPO_ROOT / "storage" / "uploads"
OUTPUT_DIR   = REPO_ROOT / "storage" / "outputs"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ─── In-memory task registry (replace with Redis for production) ───────────
task_registry: dict[str, dict] = {}

_executor = ThreadPoolExecutor(max_workers=4)


# ─── Helpers ──────────────────────────────────────────────────────────────
def _run_conversion(task_id: str, pt_path: str):
    """Synchronous conversion wrapper executed inside a thread."""
    task_registry[task_id]["status"] = "processing"
    print(f"\n[ENGINE] 🟡 Task {task_id}: Starting conversion for {pt_path}...")
    try:
        # Temporarily change cwd so relative paths inside convert_model work
        original_cwd = os.getcwd()
        work_dir = str(OUTPUT_DIR / task_id)
        os.makedirs(work_dir, exist_ok=True)

        # Copy the uploaded .pt into the work dir
        dest_pt = os.path.join(work_dir, os.path.basename(pt_path))
        shutil.copy2(pt_path, dest_pt)

        print(f"[ENGINE] 🔄 Task {task_id}: Running PyTorch -> ONNX -> TFLite...")
        os.chdir(work_dir)
        outputs = convert_model(dest_pt)
        os.chdir(original_cwd)

        task_registry[task_id]["status"]  = "completed"
        task_registry[task_id]["outputs"] = outputs
        print(f"[ENGINE] ✅ Task {task_id}: Completed successfully!")
        print(f"         Outputs: {outputs}\n")
    except Exception as exc:
        task_registry[task_id]["status"] = "failed"
        task_registry[task_id]["error"]  = str(exc)
        print(f"[ENGINE] ❌ Task {task_id}: FAILED!")
        print(f"         Error: {exc}\n")


async def start_conversion(file_id: str, pt_path: str) -> str:
    """Enqueue a conversion task and return its task_id."""
    task_id = str(uuid.uuid4())
    task_registry[task_id] = {
        "status":  "pending",
        "file_id": file_id,
        "outputs": None,
        "error":   None,
    }
    loop = asyncio.get_running_loop()
    loop.run_in_executor(_executor, _run_conversion, task_id, pt_path)
    return task_id


def get_task(task_id: str) -> dict | None:
    return task_registry.get(task_id)


def get_output_dir(task_id: str) -> Path:
    return OUTPUT_DIR / task_id
