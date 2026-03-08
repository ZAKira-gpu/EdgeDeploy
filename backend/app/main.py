from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import upload, convert, status, download

app = FastAPI(
    title="EdgeDeploy – AI Model Conversion API",
    description=(
        "Upload a PyTorch `.pt` model and convert it to ONNX and TFLite "
        "for edge deployment. All conversions run asynchronously."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(convert.router)
app.include_router(status.router)
app.include_router(download.router)


@app.get("/", tags=["Health"])
async def health():
    return {"status": "ok", "service": "EdgeDeploy Model Conversion API"}
