from pytorch_to_onnx import convert_pt_to_onnx
from onnx_to_tflite import convert_onnx_to_tflite
import os

def convert_model(pt_path, work_dir=None, precision="fp32"):
    if work_dir is None:
        work_dir = os.path.dirname(pt_path)
    
    base = os.path.splitext(os.path.basename(pt_path))[0]
    onnx_path = os.path.join(work_dir, base + ".onnx")
    tflite_path = os.path.join(work_dir, base + ".tflite")

    convert_pt_to_onnx(pt_path, onnx_path, precision=precision)
    convert_onnx_to_tflite(onnx_path, tflite_path, work_dir, precision=precision)

    return {
        "onnx": onnx_path,
        "tflite": tflite_path
    }

if __name__ == "__main__":

    result = convert_model("model.pt")

    print("Conversion finished")
    print(result)