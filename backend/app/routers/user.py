from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.services.resume_parser import resume_parser
import json
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_user_me(current_user: User = Depends(get_current_user)):
    # Create the response object, dynamically adding has_resume
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        role=current_user.role,
        has_resume=bool(current_user.parsed_resume_data)
    )

@router.post("/resume", response_model=UserResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
    try:
        file_content = await file.read()
        text_content = resume_parser.extract_text(file_content)
        
        if not text_content or len(text_content.strip()) < 50:
             raise HTTPException(status_code=400, detail="Could not extract sufficient text from PDF")

        resume_data_dict = await resume_parser.parse_resume(text_content)
        
        # Update user with resume data
        current_user.resume_text = text_content
        current_user.parsed_resume_data = json.dumps(resume_data_dict)
        
        db.add(current_user)
        await db.commit()
        await db.refresh(current_user)
        
        return UserResponse(
            id=current_user.id,
            email=current_user.email,
            role=current_user.role,
            has_resume=True
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")
