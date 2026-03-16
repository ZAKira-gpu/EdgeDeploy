import asyncio
import sys
import time

sys.path.insert(0, r'C:\Users\Dell\EdgeDeploy\backend')
from app.services.conversion_service import start_conversion, task_registry

async def main():
    print("Starting conversion directly...")
    file_id = r"C:\Users\Dell\EdgeDeploy\storage\uploads\36ac8e6c-302f-4df4-936c-b41026f6948c_yolov8n-pose.pt"
    task_id = await start_conversion(file_id, file_id)
    print(f"Task ID: {task_id}")
    
    while True:
        status = task_registry[task_id]["status"]
        print(f"Status: {status}")
        if status in ("completed", "failed"):
            if status == "failed":
                print("Error:", task_registry[task_id]["error"])
            break
        await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(main())
