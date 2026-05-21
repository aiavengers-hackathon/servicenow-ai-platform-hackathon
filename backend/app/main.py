from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.routes.admin import router as admin_router
from app.auth import router as auth_router
from app.db.database import engine
from app.db.models import Base
from app.utils.seed import seed_defaults
import os

app = FastAPI(title="ServiceNow AI Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(admin_router)
app.include_router(auth_router)

# Ensure database tables exist
Base.metadata.create_all(bind=engine)


@app.on_event("startup")
def _startup_seed():
    # Optionally auto-seed dev data when AUTO_SEED_DEV env var is set
    if os.getenv("AUTO_SEED_DEV", "false").lower() in ("1", "true", "yes"):
        admin_user = os.getenv("DEV_ADMIN_USER", "admin")
        admin_pass = os.getenv("DEV_ADMIN_PASSWORD", "changeme")
        admin_email = os.getenv("DEV_ADMIN_EMAIL", None)
        seed_defaults(admin_user, admin_pass, admin_email)

@app.get("/")
def root():
    return {"status": "running"}