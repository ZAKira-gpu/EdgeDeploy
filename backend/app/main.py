from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.routes.auth import router as auth_router
from app.routes.upload import router as upload_router
from app.routes.convert import router as convert_router
from app.routes.status import router as status_router
from app.routes.download import router as download_router
from app.routes.tasks import router as tasks_router

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

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(convert_router)
app.include_router(status_router)
app.include_router(download_router)
app.include_router(tasks_router)

# ── Serve Frontend ───────────────────────────────────────────────────────────
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))

if os.path.exists(frontend_path):
    # Mount assets (JS/CSS)
    assets_path = os.path.join(frontend_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="static")

    # Catch-all for React Router
    @app.get("/{full_path:path}", tags=["Frontend"])
    async def serve_frontend(full_path: str):
        # Exclude internal API docs
        if full_path in ["docs", "redoc", "openapi.json"]:
            return None # Let FastAPI handle these
        return FileResponse(os.path.join(frontend_path, "index.html"))
else:
    @app.get("/", tags=["Health"])
    async def health():
        return {"status": "ok", "service": "EdgeDeploy API (Frontend not built)"}

