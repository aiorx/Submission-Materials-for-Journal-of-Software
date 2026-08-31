# This code was Supported via standard programming aids as a way to create dummy data for
# the study app


import json
import random
from datetime import datetime, timedelta

# Setup for subjects and descriptions
subjects = ["typing", "Russian", "coding", "cybersecurity"]
locations = ["bedroom", "coffee shop", "library", "downstairs", "study room", "garden", "park", "living room"]
descriptions_by_subject = {
    "typing": [
        "Focused on improving speed with new drills.",
        "Practiced error-free typing under time pressure.",
        "Reviewed progress over the past week.",
        "Worked on advanced typing exercises.",
        "Analyzed typing patterns for common mistakes.",
        "Set new goals for speed and accuracy.",
        "Experimented with different keyboard layouts to improve ergonomics.",
        "Engaged in competitive typing games online.",
        "Monitored and analyzed typing speed improvements over the month.",
        "Explored various typing tutorials to refine technique.",
        "Participated in a community typing challenge.",
        "Researched the benefits of mechanical keyboards for typing efficiency."
    ],
    "Russian": [
        "Reviewed advanced grammar rules and practiced conversational phrases.",
        "Worked on pronunciation and listening skills.",
        "Completed a series of language exercises.",
        "Studied complex sentence structures and practiced reading comprehension.",
        "Engaged in a language exchange to use new vocabulary.",
        "Wrote essays to improve writing skills.",
        "Practiced with Russian language apps to enhance learning.",
        "Watched Russian films to improve listening and understanding.",
        "Participated in Russian-speaking social groups online.",
        "Reviewed historical Russian literature to gain cultural context.",
        "Took a Russian language test to evaluate progress.",
        "Explored the use of Russian in business settings."
    ],
    "coding": [
        "Developed new features for a personal project using JavaScript.",
        "Refactored old code to improve performance and maintainability.",
        "Reviewed the latest web development trends.",
        "Worked through several coding challenges to sharpen algorithms skills.",
        "Focused on learning new frameworks and libraries.",
        "Collaborated on a group project to build a small app.",
        "Attended a webinar on advanced coding techniques.",
        "Experimented with AI and machine learning algorithms.",
        "Contributed to open source projects to gain experience.",
        "Analyzed performance issues in code and optimized solutions.",
        "Explored new coding languages to broaden technical skills.",
        "Practiced debugging complex issues in a team setting."
    ],
    "cybersecurity": [
        "Updated security measures for personal devices.",
        "Studied recent trends in cybersecurity threats.",
        "Participated in an online seminar about data protection.",
        "Conducted a security audit of a small network.",
        "Learned about cryptographic methods to secure information.",
        "Collaborated with peers on a case study about preventing data breaches.",
        "Researched the latest advancements in firewall technology.",
        "Implemented new security protocols in a live environment.",
        "Analyzed real-world cyber-attack scenarios to learn response strategies.",
        "Participated in a team-building exercise focused on security crisis management.",
        "Reviewed and applied ethical hacking techniques.",
        "Explored the implications of data privacy laws in software development."
    ]
}

def generate_study_session(date, id):
    start_hour = random.randint(6, 23)  # from 6 AM to 11 PM
    start_minute = random.randint(0, 59)
    start_time = datetime.strptime(f"{start_hour}:{start_minute}", "%H:%M").strftime("%H:%M")
    duration = random.randint(45, 180)  # duration in minutes
    location = random.choice(locations)
    subject = random.choice(subjects)
    selected_descriptions = random.sample(descriptions_by_subject[subject], 3)  # Ensures unique selections
    description = " ".join(selected_descriptions)
    focus = random.randint(1, 10)
    bricked = random.choice([True, False])
    
    return {
        "id": id,
        "date": date.strftime("%Y-%m-%d"),
        "start": start_time,
        "duration": duration,
        "location": location,
        "subject": subject,
        "description": description,
        "focus": focus,
        "bricked": bricked
    }

# Generate 50 sessions over the past 60 days, including today
end_date = datetime.now()
start_date = end_date - timedelta(days=60)
study_sessions = [generate_study_session(start_date + timedelta(days=i), i+1) for i in range(50)]

# Dynamically create subjects with unique IDs
subjects_data = [{"id": i + 1, "name": subject} for i, subject in enumerate(subjects)]

# Create the JSON data structure
db_data = {"study-sessions": study_sessions, "subjects": subjects_data}

# Write to a JSON file
with open("db.json", "w") as f:
    json.dump(db_data, f, indent=4)

print("db.json has been created.")
