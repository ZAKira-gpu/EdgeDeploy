from pytorch_to_onnx import convert_pt_to_onnx
from onnx_to_tflite import convert_onnx_to_tflite
import os

def convert_model(pt_path):

    base = os.path.splitext(pt_path)[0]

    onnx_path = base + ".onnx"
    tflite_path = base + ".tflite"

    convert_pt_to_onnx(pt_path, onnx_path)
    convert_onnx_to_tflite(onnx_path, tflite_path)

    return {
        "onnx": onnx_path,
        "tflite": tflite_path
    }

if __name__ == "__main__":

    result = convert_model("model.pt")

    print("Conversion finished")
    print(result)