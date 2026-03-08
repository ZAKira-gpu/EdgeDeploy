"""
Smoke-tests the 4 API endpoints.
Run from the repo root: python test_api.py
"""
import requests
import time
import sys

BASE = "http://localhost:8000"

# 1. Health
r = requests.get(f"{BASE}/")
assert r.status_code == 200, f"Health failed: {r.text}"
print(f"[OK] GET /         => {r.json()}")

# 2. Upload
with open("conversion_engine/model.pt", "rb") as f:
    r = requests.post(f"{BASE}/upload", files={"file": ("model.pt", f, "application/octet-stream")})
assert r.status_code == 200, f"Upload failed: {r.text}"
upload_data = r.json()
file_id = upload_data["file_id"]
print(f"[OK] POST /upload  => file_id={file_id!r}")

# 3. Trigger conversion
r = requests.post(f"{BASE}/convert", json={"file_id": file_id})
assert r.status_code == 200, f"Convert failed: {r.text}"
task_id = r.json()["task_id"]
print(f"[OK] POST /convert => task_id={task_id}")

# 4. Poll status
for _ in range(30):          # up to ~30 seconds
    r = requests.get(f"{BASE}/status/{task_id}")
    status = r.json()["status"]
    print(f"     GET /status   => {status}")
    if status in ("completed", "failed"):
        break
    time.sleep(2)

assert status == "completed", f"Conversion failed: {r.json()}"
print(f"[OK] GET /status/{task_id} => completed")

# 5. Download zip
r = requests.get(f"{BASE}/download/{task_id}?format=all")
assert r.status_code == 200, f"Download failed: {r.text}"
with open("/tmp/converted_models.zip", "wb") as f:
    f.write(r.content)
print(f"[OK] GET /download => {len(r.content)} bytes written to /tmp/converted_models.zip")

print("\n✅ All tests passed!")
sys.exit(0)
