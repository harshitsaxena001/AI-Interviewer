from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.interview import InterviewStatus

class QuestionBase(BaseModel):
    id: int
    content: str
    type: str # technical, behavioral, etc.
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
    
    class Config:
        from_attributes = True

class SessionCreate(BaseModel):
    job_role: str
    jd_text: str
    candidate_id: int # For simplicity, passing ID directly. In real app, get from auth context.

class SessionResponse(BaseModel):
    id: int
    job_role: str
    status: InterviewStatus
    created_at: datetime
    questions: List[QuestionBase] = []
    
    class Config:
        from_attributes = True
