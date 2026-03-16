from sqlalchemy import String, Integer, ForeignKey, Text, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.database import Base
from typing import List, Optional
import enum

class InterviewStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class QuestionType(str, enum.Enum):
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    SITUATIONAL = "situational"
    CODING = "coding"
    FOLLOW_UP = "follow_up"

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    job_role: Mapped[str] = mapped_column(String)
    jd_text: Mapped[str] = mapped_column(Text)
    
    candidate_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    hr_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    status: Mapped[InterviewStatus] = mapped_column(Enum(InterviewStatus), default=InterviewStatus.PENDING)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    candidate = relationship("User", foreign_keys=[candidate_id], back_populates="interview_sessions")
    hr = relationship("User", foreign_keys=[hr_id], back_populates="owned_interviews")
    questions: Mapped[List["Question"]] = relationship("Question", back_populates="interview_session", cascade="all, delete-orphan")
    score_report: Mapped["ScoreReport"] = relationship("ScoreReport", back_populates="interview_session", uselist=False)


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    content: Mapped[str] = mapped_column(Text)
    question_type: Mapped[QuestionType] = mapped_column(Enum(QuestionType))
    order_index: Mapped[int] = mapped_column(Integer)
    difficulty: Mapped[str] = mapped_column(String, nullable=True) # Easy, Medium, Hard
    expected_answer: Mapped[str] = mapped_column(Text, nullable=True)
    audio_url: Mapped[str] = mapped_column(String, nullable=True)
    
    interview_session_id: Mapped[Optional[int]] = mapped_column(ForeignKey("interview_sessions.id"), nullable=True)
    practice_session_id: Mapped[Optional[int]] = mapped_column(ForeignKey("practice_sessions.id"), nullable=True)

    # Relationships
    interview_session = relationship("InterviewSession", back_populates="questions")
    practice_session = relationship("PracticeSession", back_populates="questions")
    answers: Mapped[List["Answer"]] = relationship("Answer", back_populates="question")


class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    transcript: Mapped[str] = mapped_column(Text, nullable=True)
    audio_url: Mapped[str] = mapped_column(String, nullable=True)
    submitted_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    score: Mapped[float] = mapped_column(Integer, nullable=True) # 0-100
    feedback: Mapped[str] = mapped_column(Text, nullable=True)

    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"))

    # Relationships
    question = relationship("Question", back_populates="answers")
