from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.practice import PracticeSession, ResumeData, PracticeStatus
from app.models.interview import Question, QuestionType
from app.services.resume_parser import resume_parser
from app.schemas import practice as schemas
from app.services.llm_service import llm_service
import json

router = APIRouter()

@router.post("/start", response_model=schemas.PracticeSessionResponse)
async def start_practice_session(
    file: UploadFile = File(...),
    job_role: str = Form(...),
    candidate_id: int = Form(...), # Usually from auth
    db: AsyncSession = Depends(get_db)
):
    # 1. Parse Resume
    file_content = await file.read()
    # We could save the file to a store, but for hackathon, just extract text
    # In a real app, upload to S3/Supabase Storage first.
    
    text_content = resume_parser.extract_text(file_content)
    
    if not text_content:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    # 2. Extract structured data
    # (Assuming we run this async or in background, but for MVP synchronous is simpler)
    resume_data_dict = await resume_parser.parse_resume(text_content)
    
    # 3. Create Session
    new_session = PracticeSession(
        job_role=job_role,
        resume_text=text_content, # Store full text or URL if saved
        candidate_id=candidate_id,
        status=PracticeStatus.IN_PROGRESS
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    
    # 4. Save Resume Data
    # Convert lists to JSON strings for Text columns
    new_resume_data = ResumeData(
        parsed_json=json.dumps(resume_data_dict),
        skills=json.dumps(resume_data_dict.get("skills", [])),
        experience=json.dumps(resume_data_dict.get("experience", [])),
        education=json.dumps(resume_data_dict.get("education", [])),
        practice_session_id=new_session.id
    )
    db.add(new_resume_data)
    
    # 5. Generate Tailored Questions
    # Call LLM with resume context
    questions_data = await llm_service.generate_questions(
        job_role=job_role,
        resume_text=text_content[:2000], # Pass truncated resume context
        count=5
    )
    
    # 6. Save Questions
    # Note: Question model has `practice_session_id`
    for idx, q_data in enumerate(questions_data):
        q_type_str = q_data.get("type", "technical").lower()
        try:
             q_type = QuestionType(q_type_str)
        except ValueError:
             q_type = QuestionType.TECHNICAL
             
        import urllib.parse
        content_text = q_data.get("content", "Error generating content")
        audio_url = f"/api/v1/tts/?text={urllib.parse.quote(content_text)}"
        
        new_question = Question(
            content=content_text,
            question_type=q_type,
            order_index=idx,
            difficulty=q_data.get("difficulty", "Medium"),
            expected_answer=q_data.get("expected_answer", ""),
            audio_url=audio_url,
            practice_session_id=new_session.id
        )
        db.add(new_question)
        
    await db.commit()
    await db.refresh(new_session)
    
    # Reload session with questions if needed, but response model will handle it via explicit fetch or lazy loading
    # Similar to interview router logic for loading questions if needed
    
    return new_session
