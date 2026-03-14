import fitz # PyMuPDF
import json
from app.services.llm_service import llm_service

class ResumeParser:
    def extract_text(self, file_content: bytes) -> str:
        try:
            doc = fitz.open(stream=file_content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            return ""

    async def parse_resume(self, text: str) -> dict:
        # Use LLM to structure the resume data
        # This is a simplified version. In production, use structured output prompts.
        prompt = f"""
        Extract the following information from the resume text into a valid JSON object:
        - skills (list of strings)
        - experience (list of objects with role, company, duration, description)
        - education (list of objects with degree, school, year)
        - projects (list of objects with name, description, tech_stack)
        - total_years_exp (number)

        Resume Text:
        {text[:4000]} # Limit context window if needed
        """
        
        # We can reuse the LLM service to do this extraction
        if not llm_service.model:
             return {"error": "LLM not available"}
             
        try:
            response = await llm_service.model.generate_content_async(prompt)
            json_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(json_text)
        except Exception as e:
            print(f"Error extracting resume data: {e}")
            return {}

resume_parser = ResumeParser()
