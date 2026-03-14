from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
import io
from app.services.piper_service import piper_service

router = APIRouter()

@router.get("/")
async def generate_speech(text: str = Query(..., description="Text to synthesize to speech")):
    try:
        audio_bytes = await piper_service.text_to_speech(text)
        return StreamingResponse(io.BytesIO(audio_bytes), media_type="audio/wav")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
