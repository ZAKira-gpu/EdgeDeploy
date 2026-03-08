import subprocess

def convert_onnx_to_tflite(onnx_path, tflite_path):

    tf_model_dir = "temp_tf_model"

    subprocess.run([
        "python",
        "-m",
        "tf2onnx.convert",
        "--input", onnx_path,
        "--output", tf_model_dir
    ])

    import tensorflow as tf

    converter = tf.lite.TFLiteConverter.from_saved_model(tf_model_dir)
    tflite_model = converter.convert()

    with open(tflite_path, "wb") as f:
        f.write(tflite_model)

    return tflite_path