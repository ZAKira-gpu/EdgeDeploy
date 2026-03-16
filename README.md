---
title: EdgeDeploy AI Model Conversion API
emoji: 🚀
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# EdgeDeploy — AI Model Conversion API

> Convert PyTorch models to ONNX and TFLite for edge deployment, with configurable precision quantization.

---

## Features

- **Three Precision Levels**: Export models as `fp32`, `fp16`, or `int8` (Post-Training Quantization)
- **Asynchronous Conversion**: Non-blocking background processing — upload, trigger, poll, download
- **REST API**: Clean FastAPI endpoints with auto-generated Swagger UI at `/docs`
- **Multi-Format Output**: Get both ONNX and TFLite files, or download them individually

---

## Precision Comparison

| Precision | ONNX Size | TFLite Size | Use Case |
|-----------|-----------|-------------|----------|
| `fp32`    | ~13 MB    | ~13 MB      | Max accuracy, GPU/CPU servers |
| `fp16`    | ~6.5 MB   | ~6.5 MB     | Balanced — Raspberry Pi, Jetson |
| `int8`    | ~13 MB    | **~3.4 MB** | Microcontrollers, ultra-constrained edge |

---

## Project Structure

```
EdgeDeploy/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py           # App entry point + CORS
│   │   ├── routes/           # upload, convert, status, download
│   │   ├── services/         # Conversion orchestration + task registry
│   │   └── models/           # Pydantic schemas
│   └── requirements.txt
├── conversion_engine/        # Core conversion logic
│   ├── convert.py            # Orchestrator (pt → onnx → tflite)
│   ├── pytorch_to_onnx.py   # Ultralytics YOLO export
│   ├── onnx_to_tflite.py    # onnx2tf + TFLiteConverter with PTQ
│   └── utils.py
├── worker/                   # Background worker (future: Redis queue)
├── docker/                   # Docker & docker-compose configs
│   ├── Dockerfile.worker
│   └── docker-compose.yml
├── storage/
│   ├── uploads/              # Uploaded .pt files (gitignored)
│   └── outputs/              # Converted models (gitignored)
└── test_api.py               # End-to-end integration test
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- [onnx2tf](https://github.com/PINTO0309/onnx2tf)

### Setup

```bash
git clone https://github.com/YOUR_USERNAME/EdgeDeploy.git
cd EdgeDeploy

python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/macOS

pip install -r backend/requirements.txt
pip install ultralytics onnx2tf tf-keras ai-edge-litert
```

### Run the API

```bash
cd backend
..\venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open **http://localhost:8000/docs** for the interactive Swagger UI.

---

## API Usage

### 1. Upload a model
```bash
curl -X POST "http://localhost:8000/upload" \
     -F "file=@yolov8n-pose.pt"
# Returns: { "file_id": "C:\...\uploads\xxxx_yolov8n-pose.pt" }
```

### 2. Trigger conversion
```bash
curl -X POST "http://localhost:8000/convert" \
     -H "Content-Type: application/json" \
     -d '{"file_id": "<file_id>", "precision": "int8"}'
# Returns: { "task_id": "uuid-..." }
```

### 3. Poll status
```bash
curl "http://localhost:8000/status/<task_id>"
# Returns: { "status": "completed", "outputs": { "onnx": "...", "tflite": "..." } }
```

### 4. Download
```bash
# Download INT8 TFLite (~3.4 MB)
curl "http://localhost:8000/download/<task_id>?format=tflite" -O model.tflite

# Download ONNX
curl "http://localhost:8000/download/<task_id>?format=onnx" -O model.onnx

# Download both as zip
curl "http://localhost:8000/download/<task_id>?format=all" -O models.zip
```

---

## License

MIT — see [LICENSE](LICENSE)
