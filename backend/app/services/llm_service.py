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
        You are an expert, friendly AI interviewer. The candidate just spoke.
        
        Question: {question}
        Candidate Answer: {answer}
        Context (expected response): {context or "N/A"}
        
        Analyze the 'Candidate Answer'. Are they trying to answer the question, or are they asking for help, clarification, or for you to repeat the question?

        Rule 1 - Not an answer (Asking for help/repeat/hint):
        If they seem stuck, confused, or explicitly ask for help/repeat, do NOT grade them yet. 
        Set 'is_final' to false. Provide a friendly and helpful 'ai_response' (e.g. repeat the question naturally, or give a small hint). 

        Rule 2 - Attempted an answer:
        If they attempted to answer the question (even if it's incorrect or incomplete), this is a final attempt for this question.
        Set 'is_final' to true. Grade their answer (0-100). 
        Provide a natural, conversational 'ai_response' giving them very brief immediate feedback (e.g. "Great point about X.", or "That's not quite right, but let's move on.").
        Provide detailed feedback, strengths, and improvements for their final report in the respective fields.
        
        Return ONLY a JSON object with this EXACT schema:
        {{
            "is_final": boolean,
            "ai_response": "What you say back to the candidate via Text-to-Speech",
            "score": integer (0 to 100, use 0 if not final),
            "feedback": "Detailed constructive feedback for the final report (empty if not final)",
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
            return {"score": 0, "feedback": "Error evaluating answer.", "is_final": True, "ai_response": "I encountered an error understanding that."}

llm_service = LLMService()
