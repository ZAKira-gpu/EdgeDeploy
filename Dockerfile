# Frontend Build Stage
FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Final Stage (TensorFlow)
FROM tensorflow/tensorflow:2.18.0

# ── Non-root user required by HF Spaces ──────────────────────────────────────
RUN useradd -m -u 1000 user
ENV PATH="/home/user/.local/bin:$PATH"

# ── System dependencies ────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        libgl1 \
        libglib2.0-0 \
        cmake \
        g++ \
        python3-dev \
        libffi-dev \
        libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ─── Python dependencies ──────────────────────────────────────────────────────
# Copy requirements first to leverage Docker cache
COPY --chown=user backend/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir cffi cryptography itsdangerous && \
    pip install --no-cache-dir -r /tmp/requirements.txt

# ML conversion stack (TF already installed in base image)
RUN pip install --no-cache-dir \
        ultralytics==8.4.21 \
        onnx2tf \
        tf-keras \
        ai-edge-litert \
        sng4onnx \
        onnxsim \
        onnx_graphsurgeon \
        "onnx>=1.14.0"

# ── Copy application code and built frontend ──────────────────────────────────
COPY --chown=user backend/           /app/backend/
COPY --chown=user conversion_engine/ /app/conversion_engine/
COPY --from=build-frontend --chown=user /app/dist /app/frontend/dist

# ── Storage dirs (ephemeral on free tier) ─────────────────────────────────────
RUN mkdir -p /app/storage/uploads /app/storage/outputs \
    && chown -R user:user /app/storage
    
# ── Switch to non-root user ───────────────────────────────────────────────────
USER user

# ── Environment ────────────────────────────────────────────────────────────────
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    ONNX2TF_NO_VERSION_CHECK=1 \
    TF_ENABLE_ONEDNN_OPTS=0

WORKDIR /app/backend

EXPOSE 7860

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]

