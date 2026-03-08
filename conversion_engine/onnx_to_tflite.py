import subprocess
import tensorflow as tf
import os
import sys

def convert_onnx_to_tflite(onnx_path, tflite_path):
    tf_model_dir = "temp_tf_model"
    # Call onnx2tf using the python module to skip missing executable wrapper errors
    print(f"Running ONNX to TF via python -m onnx2tf")
    result = subprocess.run([
        sys.executable,
        "-m", "onnx2tf",
        "-i", onnx_path,
        "-o", tf_model_dir,
        "--non_verbose"
    ], capture_output=True, text=True)

    if result.returncode != 0:
        raise RuntimeError(f"onnx2tf failed:\n{result.stderr}\n{result.stdout}")

    converter = tf.lite.TFLiteConverter.from_saved_model(tf_model_dir)
    tflite_model = converter.convert()

    with open(tflite_path, "wb") as f:
        f.write(tflite_model)

    return tflite_path