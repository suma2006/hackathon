import os
import google.generativeai as genai
from dotenv import load_dotenv

# This line loads the API_KEY from your .env file
load_dotenv()

# This configures the library with your key
genai.configure(api_key=os.getenv("API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

def get_ai_nudge(student_data: dict, analysis_result: dict) -> str:
    """
    Generates a personalized nudge using data from data.json and logic.py.
    Returns a nudge message as a string.
    """
    try:
        # Determine a dynamic tone using the 'risk_label' from logic.py
        tone = "urgent and motivational" if analysis_result.get('risk_label') == 'High' else "encouraging and challenging"

        # This is the updated prompt that uses the correct snake_case variable names
        prompt = f"""
        **Persona:** You are an expert, friendly student coach at upGrad.

        **Context:** You are writing a short message for a learner named {student_data.get('name', 'there')}. Their data is:
        - Course: Data Science Pro
        - Last Login: {student_data.get('last_login_days_ago', 'recently')} days ago
        - Average Quiz Score: {student_data.get('quiz_avg_score', 0)}%
        - Overall Engagement Score: {analysis_result.get('risk_score', 0)}/100

        **Task:** Write a personalized, {tone} message (under 40 words).
        - If their risk is 'High' (risk_label is "High"), suggest one small, easy action to get them back on track.
        - If their risk is 'Low' (risk_label is "Low"), congratulate them and offer a simple challenge.
        - Be specific and action-oriented.

        **Message:**
        """

        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception as e:
        # The safety net fallback message remains the same
        print(f"🛑 AI API Error: {e}")
        return f"Keep up the great work, {student_data.get('name', 'there')}! Your dedication is paying off."