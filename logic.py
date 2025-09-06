import json

def load_all_students():
    """Opens and loads all student data from the JSON file."""
    with open('data.json', 'r') as f:
        student_list = json.load(f)
    return student_list

def analyze_student_risk(student_data):
    """
    Analyzes a single student's record and returns a full risk assessment.
    """
    # Part 1: Get the raw data from the student's record
    quiz_score = student_data.get('quiz_avg_score', 0)
    time_spent = student_data.get('time_spent_minutes', 0)
    logins = student_data.get('login_frequency', 0)
    days_ago = student_data.get('last_login_days_ago', 0)

    # Part 2: Normalize values to a 0-100 scale
    # Assuming 180 mins/week is a perfect score
    time_score = min((time_spent / 180) * 100, 100) 
    # Assuming 5 logins/week is a perfect score
    login_score = min((logins / 5) * 100, 100)
    # Create a penalty for inactivity
    login_penalty = min(days_ago * 10, 100)

    # Part 3: Calculate the final risk_score (higher is better)
    engagement_score = (quiz_score * 0.5) + (time_score * 0.2) + (login_score * 0.2) - (login_penalty * 0.1)
    final_score = max(0, min(engagement_score, 100))

    # Part 4: Determine Label, Reasons, and Action based on the score
    risk_label = ""
    reasons = []
    recommended_action = ""

    if final_score < 40:
        risk_label = "High"
        reasons.append("Low quiz scores and platform engagement.")
        if days_ago > 7:
            reasons.append("Inactive for over a week.")
        recommended_action = "mentor"
    elif final_score < 70:
        risk_label = "Medium"
        reasons.append("Inconsistent quiz performance or activity.")
        recommended_action = "micro-lesson"
    else:
        risk_label = "Low"
        reasons.append("Strong performance and consistent activity.")
        recommended_action = "congratulate"

    # Part 5: Assemble and return the final dictionary
    analysis_result = {
        "risk_score": round(final_score),
        "risk_label": risk_label,
        "reasons": reasons,
        "recommended_action": recommended_action
    }
    
    return analysis_result


# This block runs only when you execute "python logic.py" from your terminal
if __name__ == "__main__":
    all_students = load_all_students()
    
    print("--- Running Risk Analysis on All Students ---")
    
    for student in all_students:
        analysis = analyze_student_risk(student)
        print(f"\nAnalysis for {student['name']}:")
        # Pretty print the analysis dictionary
        print(json.dumps(analysis, indent=2))
