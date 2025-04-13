import sys
import json
import pickle
import numpy as np

# Load OWASP categories and skill levels
owasp_categories = {
    "Broken Access Control": [1, 2, 3],
    "Cryptographic Failures": [4, 5, 6],
    "Injection": [7, 8, 9],
    "Insecure Design": [10, 11, 12],
    "Security Misconfiguration": [13, 14, 15],
    "Vulnerable and Outdated Components": [16, 17, 18],
    "Identification and Authentication Failures": [19, 20, 21],
    "Software and Data Integrity Failures": [22, 23, 24],
    "Security Logging and Monitoring Failures": [25, 26, 27],
    "Server-Side Request Forgery (SSRF)": [28, 29, 30],
}

skill_levels = {
    3: "Expert",
    2: "Advanced",
    1: "Intermediate",
    0: "Beginner"
}

def evaluate_user(user_answers):
    """Evaluates the user's knowledge and recommends learning modules with skill levels."""
    evaluation = {}
    recommended_modules = []

    for category, questions in owasp_categories.items():
        correct_answers = sum(user_answers[q - 1] for q in questions)
        skill_level = skill_levels.get(correct_answers, "Beginner")
        evaluation[category] = skill_level

        if skill_level in ["Beginner", "Intermediate"]:
            recommended_modules.append({"category": category, "skill_level": skill_level})
    
    recommended_modules.sort(key=lambda x: ["Beginner", "Intermediate", "Advanced", "Expert"].index(x["skill_level"]))

    return {
        "evaluation": evaluation,
        "recommended_courses": recommended_modules
    }

if __name__ == "__main__":
    # Read JSON input from Node.js
    user_input = json.loads(sys.stdin.read())
    user_answers = user_input["responses"]  # Extract user responses list
    
    # Evaluate the user responses
    result = evaluate_user(user_answers)
    
    # Print result as JSON (Node.js will capture this)
    print(json.dumps(result))
