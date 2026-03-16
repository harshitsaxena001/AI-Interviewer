from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models.interview import InterviewSession, Question, Answer, InterviewStatus, QuestionType
from app.schemas import interview as schemas
from app.services.llm_service import llm_service

router = APIRouter()

from app.routers.auth import get_current_user
from app.models.user import User

@router.post("/create", response_model=schemas.SessionResponse)
async def create_interview_session(
    session_data: schemas.SessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 1. Create a new Interview Session
    new_session = InterviewSession(
        job_role=session_data.job_role,
        jd_text=session_data.jd_text or "",
        candidate_id=current_user.id,
        hr_id=current_user.id, # Placeholder for HR ID
        status=InterviewStatus.PENDING
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)

    # 4. Generate Questions using LLM (using the user's saved resume text as context)
    questions_data = await llm_service.generate_questions(
        job_role=session_data.job_role,
        jd_text=session_data.jd_text,
        resume_text=current_user.resume_text, # passing the user's stored resume
        count=5
    )

    # 5. Save Questions to DB
    for idx, q_data in enumerate(questions_data):
        # Validate or default the question type
        q_type_str = q_data.get("type", "technical").lower()
        # Map string to enum if possible, else default
        try:
             q_type = QuestionType(q_type_str)
        except ValueError:
             q_type = QuestionType.TECHNICAL
            
        new_question = Question(
            content=q_data.get("content", "Error generating content"),
            question_type=q_type,
            order_index=idx,
            difficulty=q_data.get("difficulty", "Medium"),
            expected_answer=q_data.get("expected_answer", ""),
            interview_session_id=new_session.id
        )
        db.add(new_question)
    
    await db.commit()
    
    # Reload session with questions
    result = await db.execute(
        select(InterviewSession)
        .options(selectinload(InterviewSession.questions))
        .where(InterviewSession.id == new_session.id)
    )
    session_loaded = result.scalars().first()
    return session_loaded

@router.get("/{session_id}", response_model=schemas.SessionResponse)
async def get_interview_session(session_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(InterviewSession)
        .options(selectinload(InterviewSession.questions))
        .where(InterviewSession.id == session_id)
    )
    session = result.scalars().first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Explicitly load questions if they aren't loaded by default (lazy loading is async in SQLAlchemy)
    # Pydantic's from_attributes might trigger lazy load which fails.
    # Better to join them in the query or use explicit loading strategy.
    # For now, let's assume lazy loading works if we access it within session or use options.
    # Wait, async lazy loading is tricky. Let's fetch questions explicitly to be safe.
    # We already used selectinload in the query above so session.questions is populated.
    
    return session

@router.get("/list", response_model=List[schemas.SessionResponse])
async def list_interview_sessions(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    # In a real app, filter by current user (HR)
    result = await db.execute(
        select(InterviewSession)
        .options(selectinload(InterviewSession.questions))
        .offset(skip).limit(limit)
    )
    sessions = result.scalars().all()
    return sessions

@router.post("/{session_id}/answer", response_model=schemas.AnswerResponse)
async def submit_answer(
    session_id: int,
    answer_data: schemas.AnswerCreate,
    db: AsyncSession = Depends(get_db)
):
    # Verify Question belongs to Session
    q_result = await db.execute(select(Question).where(Question.id == answer_data.question_id))
    question = q_result.scalars().first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    if question.interview_session_id != session_id:
         raise HTTPException(status_code=400, detail="Question does not belong to this session")

    # Evaluate Answer with LLM
    eval_result = await llm_service.evaluate_answer(
        question=question.content,
        answer=answer_data.transcript,
        context=question.expected_answer
    )
    
    score = eval_result.get("score", 0)
    feedback = eval_result.get("feedback", "No feedback generated.")
    
    # Save Answer
    new_answer = Answer(
        transcript=answer_data.transcript,
        audio_url=answer_data.audio_url,
        score=score,
        feedback=feedback,
        question_id=question.id
    )
    db.add(new_answer)
    await db.commit()
    await db.refresh(new_answer)
    
    return new_answer

from fastapi import UploadFile, File, Form
from app.services.stt_service import stt_service

@router.post("/{session_id}/answer-audio", response_model=schemas.AnswerResponse)
async def submit_audio_answer(
    session_id: int,
    question_id: int = Form(...),
    audio_file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    # Verify Question belongs to Session
    q_result = await db.execute(select(Question).where(Question.id == question_id))
    question = q_result.scalars().first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    if question.interview_session_id != session_id:
         raise HTTPException(status_code=400, detail="Question does not belong to this session")

    # Transcribe audio
    # Save audio locally
    import os
    import time
    
    audio_bytes = await audio_file.read()
    
    upload_dir = "uploads/audio"
    os.makedirs(upload_dir, exist_ok=True)
    filename = f"{session_id}_{question_id}_{int(time.time())}.webm"
    file_path = os.path.join(upload_dir, filename)
    with open(file_path, "wb") as f:
        f.write(audio_bytes)

    # Transcribe audio
    transcript = await stt_service.transcribe_audio(audio_bytes)

    if transcript.startswith("Transcription error"):
        # Don't fail hard, LLM might be able to handle empty/garbage transcript with conversational fallback
        transcript = "[Inaudible or transcription failed]"

    # Evaluate Answer with LLM
    eval_result = await llm_service.evaluate_answer(
        question=question.content,
        answer=transcript,
        context=question.expected_answer
    )
    
    score = eval_result.get("score", 0)
    feedback = eval_result.get("feedback", "No feedback generated.")
    is_final = eval_result.get("is_final", True)
    ai_response = eval_result.get("ai_response", "Thank you.")
    
    # Save Answer
    new_answer = Answer(
        transcript=transcript,
        audio_url=file_path, 
        score=score,
        feedback=feedback,
        question_id=question.id
    )
    db.add(new_answer)
    await db.commit()
    await db.refresh(new_answer)
    
    # Return Pydantic schema with dynamically added LLM flags
    resp = schemas.AnswerResponse.model_validate(new_answer)
    resp.is_final = is_final
    resp.ai_response = ai_response
    
    return resp
