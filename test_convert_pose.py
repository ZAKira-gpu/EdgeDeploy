import sys
import traceback
sys.path.insert(0, r'C:\Users\Dell\EdgeDeploy\conversion_engine')
from convert import convert_model

try:
    res = convert_model(r'C:\Users\Dell\EdgeDeploy\storage\uploads\36ac8e6c-302f-4df4-936c-b41026f6948c_yolov8n-pose.pt')
    print("SUCCESS")
    print(res)
except Exception as e:
    print("ERROR")
    traceback.print_exc()
