import google.generativeai as genai
from app.config import settings
import json
from typing import Optional

class LLMService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            print("WARNING: GEMINI_API_KEY not found. LLM features will fail.")
            self.model = None

    async def generate_questions(self, job_role: str, jd_text: Optional[str] = None, resume_text: Optional[str] = None, count: int = 5) -> list[dict]:
        if not self.model:
            return []
            
        context = f"Job Role: {job_role}\n"
        if jd_text:
            context += f"Job Description: {jd_text}\n"
        if resume_text:
            context += f"Candidate Resume: {resume_text}\n"
            
        prompt = f"""
        Generate {count} interview questions for a {job_role} position.
        Context:
        {context}
        
        Return the response as a valid JSON array of objects with the following schema:
        [
            {{
                "content": "Question text",
                "type": "technical" | "behavioral" | "situational",
                "difficulty": "Easy" | "Medium" | "Hard",
                "expected_answer": "Brief summary of key points expected in the answer"
            }}
        ]
        """
        
        try:
            response = await self.model.generate_content_async(prompt)
            # Remove markdown formatting if present
            text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        except Exception as e:
            print(f"Error generating questions: {e}")
            return []

    async def evaluate_answer(self, question: str, answer: str, context: Optional[str] = None) -> dict:
        if not self.model:
            return {}
            
        prompt = f"""
        You are an expert interviewer. Evaluate the candidate's answer to the following question.
        
        Question: {question}
        Candidate Answer: {answer}
        Context: {context or "N/A"}
        
        Return a JSON object with:
        {{
            "score": 0-100 (integer),
            "feedback": "Constructive feedback string",
            "strengths": ["list", "of", "strengths"],
            "improvements": ["list", "of", "improvements"]
        }}
        """
        
        try:
            response = await self.model.generate_content_async(prompt)
            text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        except Exception as e:
            print(f"Error evaluating answer: {e}")
            return {"score": 0, "feedback": "Error evaluating answer."}

llm_service = LLMService()
