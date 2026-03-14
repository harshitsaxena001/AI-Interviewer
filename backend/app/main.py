from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base

# Import all models to ensure they are registered with SQLAlchemy
from app.models import user, interview, practice, score

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables (for development with SQLite)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all. In production, specify domains.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import auth, interview, practice, tts

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(interview.router, prefix="/api/v1/interview", tags=["interview"])
app.include_router(practice.router, prefix="/api/v1/practice", tags=["practice"])
app.include_router(tts.router, prefix="/api/v1/tts", tags=["tts"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI Interviewer Platform API"}
