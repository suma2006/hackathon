from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

# --- Local Imports (from your learner analysis file) ---
# Make sure you have the 'logic.py' and 'ai_nudge.py' files in the same directory.
from logic import load_all_students, analyze_student_risk
from ai_nudge import get_ai_nudge

# --- Configuration ---
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) for the entire app
CORS(app) 

# --- In-Memory Database (for user authentication) ---
# In a real-world application, this would be a proper database.
users_db = {}

# --- Authentication API Endpoints ---

@app.route('/api/signup', methods=['POST'])
def signup():
    """Handles new user registration."""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password') or not data.get('fullName'):
        return jsonify({"error": "Missing required fields"}), 400

    email = data['email']
    password = data['password']
    full_name = data['fullName']

    for user_id, user_data in users_db.items():
        if user_data['email'] == email:
            return jsonify({"error": "Email address already registered"}), 409

    hashed_password = generate_password_hash(password)
    user_id = str(uuid.uuid4())
    users_db[user_id] = {
        "fullName": full_name,
        "email": email,
        "password": hashed_password
    }

    print("--- User Database Updated ---")
    print(users_db)
    print("--------------------------")

    return jsonify({"message": "Account created successfully!"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    """Handles user login verification."""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    email = data['email']
    password = data['password']
    
    user_to_check = None
    for user_id, user_data in users_db.items():
        if user_data['email'] == email:
            user_to_check = user_data
            break
            
    if user_to_check and check_password_hash(user_to_check['password'], password):
        return jsonify({
            "message": "Login successful!",
            "fullName": user_to_check['fullName']
        }), 200
    
    return jsonify({"error": "Invalid email or password"}), 401

# --- Learner Analysis API Endpoints ---

@app.route('/api/learners/analysis', methods=['GET'])
def get_learner_analysis():
    """
    Loads all students, runs risk analysis, and returns the combined data.
    """
    print("API CALL: /api/learners/analysis")
    all_students = load_all_students()
    
    results = []
    for student in all_students:
        analysis = analyze_student_risk(student)
        results.append({**student, 'analysis': analysis})
        
    return jsonify(results)

@app.route('/api/generate-nudge', methods=['POST'])
def generate_nudge():
    """
    Generates an AI nudge for a specific student.
    """
    print("API CALL: /api/generate-nudge")
    request_data = request.get_json()
    student_id = request_data.get('id')
    
    if not student_id:
        return jsonify({"error": "Student 'id' is required"}), 400

    all_students = load_all_students()
    target_student = next((s for s in all_students if s['id'] == student_id), None)

    if not target_student:
        return jsonify({"error": "Student not found"}), 404
        
    analysis = analyze_student_risk(target_student)
    nudge_message = get_ai_nudge(target_student, analysis)
    
    return jsonify({"nudge": nudge_message})

# --- Main Execution ---

if __name__ == '__main__':
    print("--- Starting the LearnSync Backend Server ---")
    print("Server is running at http://127.0.0.1:5000")
    # Using host='0.0.0.0' to be accessible, and debug=True for development
    app.run(host='0.0.0.0', port=5000, debug=True)