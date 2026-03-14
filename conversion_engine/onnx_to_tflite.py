import subprocess
import tensorflow as tf
import os
import sys

def convert_onnx_to_tflite(onnx_path, tflite_path, work_dir=None, precision="fp32"):
    if work_dir is None:
        work_dir = os.path.dirname(onnx_path)
    
    tf_model_dir = "temp_tf_model"  # Created inside work_dir via cwd
    # Stream onnx2tf output so the user sees live progress instead of thinking it's hanging
    print(f"Running ONNX to TF via python -m onnx2tf in {work_dir}")
    
    # Disable onnx2tf update check to prevent random network timeouts
    os.environ["ONNX2TF_NO_VERSION_CHECK"] = "1"
    
    cmd = [
        sys.executable,
        "-m", "onnx2tf",
        "-i", onnx_path,
        "-o", tf_model_dir,
    ]
    
    # Do not use sys.stdout in a ThreadPool under Uvicorn, it crashes the ASGI worker.
    # Instead, capture to a file so it doesn't deadlock the server but is still readable if needed.
    log_path = os.path.join(work_dir, "conversion.log")
    with open(log_path, "w") as log_f:
        process = subprocess.Popen(cmd, stdout=log_f, stderr=subprocess.STDOUT, cwd=work_dir)
        process.wait()

    if process.returncode != 0:
        # Read the log to raise actionable error
        with open(log_path, "r") as log_f:
            error_msg = log_f.read()
        raise RuntimeError(f"onnx2tf failed with exit code {process.returncode}:\n{error_msg}")

    absolute_tf_model_dir = os.path.join(work_dir, tf_model_dir)
    converter = tf.lite.TFLiteConverter.from_saved_model(absolute_tf_model_dir)
    
    if precision == "fp16":
        print("[ENGINE] 🗜️ Applying FP16 Quantization to reduce model size...")
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        converter.target_spec.supported_types = [tf.float16]
    elif precision == "int8":
        print("[ENGINE] 🗜️ Applying INT8 Post-Training Quantization for minimum size...")
        
        # INT8 requires a representative dataset to calibrate activation ranges
        def representative_dataset():
            # 10 samples is usually enough for a quick calibration without taking 10 minutes on CPU
            for _ in range(10):
                # Dummy YOLO input shape: [1, 3, 640, 640] with normalized float32 values
                yield [tf.random.uniform([1, 640, 640, 3], minval=0., maxval=1., dtype=tf.float32)]
                
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        converter.representative_dataset = representative_dataset
        
        # Optional: restrict to strictly INT8 operations if supported
        # converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]

    tflite_model = converter.convert()

    with open(tflite_path, "wb") as f:
        f.write(tflite_model)

    return tflite_path