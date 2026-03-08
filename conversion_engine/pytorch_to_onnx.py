import torch

def convert_pt_to_onnx(pt_path, onnx_path):
    model = torch.load(pt_path, map_location="cpu")
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