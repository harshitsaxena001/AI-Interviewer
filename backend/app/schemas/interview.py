from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.interview import InterviewStatus

class QuestionBase(BaseModel):
    id: int
    content: str
    question_type: str # renamed from 'type' to match SQLAlchemy model
    difficulty: Optional[str] = None
    order_index: int
    audio_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class QuestionCreate(BaseModel):
    content: str
    type: str
    difficulty: Optional[str] = None
    expected_answer: Optional[str] = None
    order_index: int

class AnswerCreate(BaseModel):
    transcript: str
    audio_url: Optional[str] = None
    question_id: int

class AnswerResponse(BaseModel):
    id: int
    transcript: Optional[str]
    score: Optional[float]
    feedback: Optional[str]
    submitted_at: datetime
    is_final: bool = True
    ai_response: str = ""
    
    class Config:
        from_attributes = True

class SessionCreate(BaseModel):
    job_role: str
    jd_text: str

class SessionResponse(BaseModel):
    id: int
    job_role: str
    status: InterviewStatus
    created_at: datetime
    questions: List[QuestionBase] = []
    
    class Config:
        from_attributes = True
