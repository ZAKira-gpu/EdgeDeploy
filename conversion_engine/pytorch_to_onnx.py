import torch

def convert_pt_to_onnx(pt_path, onnx_path):
    checkpoint = torch.load(pt_path, map_location="cpu", weights_only=False)
    
    if isinstance(checkpoint, dict):
        # Extract the model from the Ultralytics checkpoint dictionary
        model = checkpoint.get("ema") or checkpoint.get("model")
    else:
        model = checkpoint
        
    if hasattr(model, "float"):
        model.float()
        
    model.eval()

    dummy_input = torch.randn(1, 3, 640, 640)

    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        input_names=["input"],
        output_names=["output"],
        opset_version=12
    )

    return onnx_path