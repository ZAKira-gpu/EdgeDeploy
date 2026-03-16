from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.routes import upload, convert, status, download, auth
from app.database import engine, Base
from app.config.settings import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EdgeDeploy – AI Model Conversion API",
    description=(
        "Upload a PyTorch `.pt` model and convert it to ONNX and TFLite "
        "for edge deployment. All conversions run asynchronously."
    ),
    version="1.0.0",
)

# Mandatory for OAuth state management
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(convert.router)
app.include_router(status.router)
app.include_router(download.router)


@app.get("/", tags=["Health"])
async def health():
    return {"status": "ok", "service": "EdgeDeploy Model Conversion API"}
