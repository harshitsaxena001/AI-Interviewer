import os
import io
import wave
import json
import logging
import asyncio
from typing import Optional
from pathlib import Path
import httpx
from piper.voice import PiperVoice

logger = logging.getLogger(__name__)

MODELS_DIR = Path(__file__).parent.parent.parent / "models" / "piper"
MODEL_NAME = "en_US-danny-low"
MODEL_FILE = MODELS_DIR / f"{MODEL_NAME}.onnx"
CONFIG_FILE = MODELS_DIR / f"{MODEL_NAME}.onnx.json"

MODEL_URL = f"https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/danny/low/{MODEL_NAME}.onnx"
CONFIG_URL = f"https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/danny/low/{MODEL_NAME}.onnx.json"

class PiperService:
    def __init__(self):
        self.voice: Optional[PiperVoice] = None
        self._lock = asyncio.Lock()

    async def _ensure_model_downloaded(self):
        if MODEL_FILE.exists() and CONFIG_FILE.exists():
            return

        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        logger.warning(f"Downloading Piper model {MODEL_NAME}...")

        async with httpx.AsyncClient(timeout=300.0) as client:
            # Download onnx config
            response = await client.get(CONFIG_URL, follow_redirects=True)
            response.raise_for_status()
            CONFIG_FILE.write_bytes(response.content)
            
            # Download onnx model
            response = await client.get(MODEL_URL, follow_redirects=True)
            response.raise_for_status()
            MODEL_FILE.write_bytes(response.content)

        logger.warning("Piper model downloaded successfully.")

    async def initialize(self):
        async with self._lock:
            if self.voice is None:
                await self._ensure_model_downloaded()
                # Run CPU intensive load in executor
                self.voice = await asyncio.to_thread(
                    PiperVoice.load, str(MODEL_FILE), config_path=str(CONFIG_FILE)
                )

    async def text_to_speech(self, text: str) -> bytes:
        await self.initialize()
        
        # Piper synthesize is CPU bound
        audio_stream = io.BytesIO()
        
        def _synthesize():
            # Piper supports streaming, but we'll use wave directly to memory here
            with wave.open(audio_stream, 'wb') as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2)
                wav_file.setframerate(self.voice.config.sample_rate)
                # Piper synthesize returns an Iterable of AudioChunk objects
                for chunk in self.voice.synthesize(text):
                    wav_file.writeframes(chunk.audio_int16_bytes)
                
        await asyncio.to_thread(_synthesize)
        return audio_stream.getvalue()

piper_service = PiperService()
