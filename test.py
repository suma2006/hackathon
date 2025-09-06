# test.py
from ai_nudge import get_ai_nudge
from logic import load_all_students, analyze_student_risk

# Step 1: Load all student data from data.json, just like the backend will
all_students = load_all_students()

# --- Test Case 1: High-Risk Learner ---
print("--- Testing Nudge for High-Risk Learner (Aarav) ---")
# Find a specific high-risk student from the loaded data
high_risk_student = next((s for s in all_students if s['id'] == 'S101'), None)

if high_risk_student:
    # Step 2: Run the risk analysis on that student
    analysis = analyze_student_risk(high_risk_student)
    
    # Step 3: Call the AI function with both the student's data and the analysis result
    print(get_ai_nudge(high_risk_student, analysis))
else:
    print("High-risk student not found in data.json")


# --- Test Case 2: Low-Risk Learner ---
print("\n--- Testing Nudge for Low-Risk Learner (Rahul) ---")
# Find a specific low-risk student from the loaded data
low_risk_student = next((s for s in all_students if s['id'] == 'S111'), None)

if low_risk_student:
    # Step 2: Run the risk analysis on that student
    analysis = analyze_student_risk(low_risk_student)

    # Step 3: Call the AI function with both dictionaries
    print(get_ai_nudge(low_risk_student, analysis))
else:
    print("Low-risk student not found in data.json")