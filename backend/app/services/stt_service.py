from faster_whisper import WhisperModel
import tempfile
import os
import io

class STTService:
    def __init__(self):
        # We use the tiny or small model for speed in a hackathon setting.
        # "base" provides a good balance.
        try:
            self.model = WhisperModel("base", device="cpu", compute_type="int8")
            print("Successfully loaded faster-whisper model (base).")
        except Exception as e:
            print(f"Failed to load faster-whisper: {e}")
            self.model = None

    async def transcribe_audio(self, audio_bytes: bytes) -> str:
        if not self.model:
            return "Transcription failed: Model not loaded."
            
        # Write bytes to a temporary file because faster-whisper expects a file path or a file-like object
        # but file-like objects can sometimes be finicky depending on the format.
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
                temp_audio.write(audio_bytes)
                temp_audio_path = temp_audio.name

            segments, info = self.model.transcribe(temp_audio_path, beam_size=5)
            
            transcript = []
            for segment in segments:
                transcript.append(segment.text)
                
            os.remove(temp_audio_path)
            return " ".join(transcript).strip()
            
        except Exception as e:
            print(f"Error transcribing audio: {e}")
            return "Transcription error."

stt_service = STTService()
