"""
Smoke-tests the 4 API endpoints.
Run from the repo root: python test_api.py
"""
import requests
import time
import sys
import os

BASE = "http://localhost:8000"
DOWNLOAD_OUT = os.path.join(os.path.dirname(__file__), "converted_models.zip")

# 1. Health
r = requests.get(f"{BASE}/")
assert r.status_code == 200, f"Health failed: {r.text}"
print(f"[OK] GET /         => {r.json()}")

# 2. Upload — re-use an already-uploaded file so we skip the big transfer
with open("storage/uploads/36ac8e6c-302f-4df4-936c-b41026f6948c_yolov8n-pose.pt", "rb") as f:
    r = requests.post(f"{BASE}/upload", files={"file": ("yolov8n-pose.pt", f, "application/octet-stream")})
assert r.status_code == 200, f"Upload failed: {r.text}"
file_id = r.json()["file_id"]
print(f"[OK] POST /upload  => file_id={file_id!r}")

# 3. Trigger conversion
r = requests.post(f"{BASE}/convert", json={"file_id": file_id, "precision": "int8"})
assert r.status_code == 200, f"Convert failed: {r.text}"
task_id = r.json()["task_id"]
print(f"[OK] POST /convert => task_id={task_id}")
print("     ⏳ Conversion running (~2-3 min on CPU). Polling every 5s...")

# 4. Poll until done — up to 10 minutes (INT8 PTQ is slow on CPU)
for i in range(120):
    time.sleep(5)
    r = requests.get(f"{BASE}/status/{task_id}")
    data = r.json()
    status = data["status"]
    print(f"     [{i*5:>3}s] status={status}")
    if status == "completed":
        print(f"         outputs: {data.get('outputs')}")
        break
    if status == "failed":
        print(f"         error: {data.get('error')}")
        break

assert status == "completed", f"Conversion did not complete: {data}"
print(f"[OK] Conversion completed!")

# 5. Download zip
r = requests.get(f"{BASE}/download/{task_id}?format=all")
assert r.status_code == 200, f"Download failed: {r.text}"
with open(DOWNLOAD_OUT, "wb") as f:
    f.write(r.content)
size_kb = len(r.content) // 1024
print(f"[OK] GET /download => {size_kb} KB written to {DOWNLOAD_OUT}")

print("\n✅ All tests passed!")
sys.exit(0)
