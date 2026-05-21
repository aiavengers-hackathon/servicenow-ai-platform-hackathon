from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.routes.admin import router as admin_router
from app.db.database import engine
from app.db.models import Base

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

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"status": "running"}