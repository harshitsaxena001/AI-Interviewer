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
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import time
from fastapi import Request

class LogColors:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BLUE = "\033[94m"
    PURPLE = "\033[95m"
    CYAN = "\033[96m"

@app.middleware("http")
async def colorful_logger_middleware(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    response_time_ms = round(process_time * 1000, 2)
    
    status_code = response.status_code
    if status_code < 300:
        status_color = LogColors.GREEN
    elif status_code < 400:
        status_color = LogColors.YELLOW
    else:
        status_color = LogColors.RED
        
    method_color = LogColors.PURPLE
    time_color = LogColors.CYAN
    path_color = LogColors.BLUE
    
    log_msg = (
        f"{LogColors.BOLD}{LogColors.CYAN}[AI-Logger]{LogColors.RESET} "
        f"{method_color}{request.method}{LogColors.RESET} "
        f"{path_color}{request.url.path}{LogColors.RESET} "
        f"| Status: {status_color}{status_code}{LogColors.RESET} "
        f"| Time: {time_color}{response_time_ms}ms{LogColors.RESET}"
    )
    
    # Don't double log the boring unstyled uvicorn messages, but fastAPI allows print
    print(log_msg)
    
    return response

from app.routers import auth, interview, practice, tts, user

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(user.router, prefix="/api/v1/user", tags=["user"])
app.include_router(interview.router, prefix="/api/v1/interview", tags=["interview"])
app.include_router(practice.router, prefix="/api/v1/practice", tags=["practice"])
app.include_router(tts.router, prefix="/api/v1/tts", tags=["tts"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI Interviewer Platform API"}
