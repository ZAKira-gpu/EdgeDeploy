# EdgeDeploy: AI Model Conversion Service

Efficiently convert AI models from PyTorch to ONNX and TFLite for edge deployment.

## Architecture

```text
├── backend/            # FastAPI API Layer
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── config/
│   └── requirements.txt
├── worker/             # Background Task Processor
│   ├── worker.py
│   └── converters/
├── conversion_engine/  # Model Conversion Logic
│   ├── pytorch_to_onnx.py
│   ├── onnx_to_tflite.py
│   └── utils.py
├── storage/            # Local Model Storage
├── docker/             # Orchestration & Infrastructure
│   ├── Dockerfile.worker
│   └── docker-compose.yml
```

## Features

- **Asynchronous Processing**: Uses background workers for efficient model conversion.
- **Multi-Format Support**: Export PyTorch models to ONNX and convert to TFLite.
- **Dockerized Structure**: Ready for containerized deployment.

## Getting Started

1.  **Clone the repository**.
2.  **Environment Setup**: Install dependencies via `pip install -r backend/requirements.txt`.
3.  **Run with Docker**: `docker-compose -f docker/docker-compose.yml up --build`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
