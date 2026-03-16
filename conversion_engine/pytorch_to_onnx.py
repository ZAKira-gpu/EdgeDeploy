import shutil
import os
from pathlib import Path

def convert_pt_to_onnx(pt_path: str, onnx_path: str, precision: str = "fp32") -> str:
    """
    Export a YOLO .pt model to ONNX using the official Ultralytics export API.
    The resulting ONNX file is moved to `onnx_path`.
    """
    from ultralytics import YOLO

    model = YOLO(pt_path)
    
    is_fp16 = precision == "fp16"
    # NOTE: ONNX format does NOT support int8=True in Ultralytics.
    # For int8 precision, we export a standard FP32 ONNX here —
    # the actual INT8 quantization is applied by TFLiteConverter in the next stage.
    
    if is_fp16:
        print("[ENGINE] 🗜️ Exporting ONNX in FP16 precision...")
    else:
        print("[ENGINE] 📦 Exporting ONNX in FP32 (INT8 quantization will be applied at TFLite stage)...")

    # Ultralytics exports to <stem>.onnx next to the .pt file by default
    exported = model.export(format="onnx", imgsz=640, opset=12, dynamic=False, half=is_fp16)
    # `exported` is the path to the .onnx file ultralytics created
    exported = str(exported)

    # Move it to the caller-specified destination
    if os.path.abspath(exported) != os.path.abspath(onnx_path):
        shutil.move(exported, onnx_path)

    return onnx_path