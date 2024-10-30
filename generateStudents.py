import openai
import json
import random
import pandas as pd
from faker import Faker
import re
from tqdm import tqdm  # For the progress bar

# Initialize Faker
fake = Faker()

openai.api_key = "YOUR_API_KEY_HERE"

# Load courses data from JSON
with open('structured_courses.json', 'r') as f:
    courses_data = json.load(f)

# Define the base distribution for each major
base_distribution = {
    "Computer Science": 0.2,
    "Engineering": 0.2,
    "Business": 0.2,
    "Physics": 0.05,
    "Biology": 0.1,
    "Chemistry": 0.05,
    "Other": 0.2
}

# Define "help needed" courses by level for each major
help_courses = {
    "Computer Science": {
        "Freshman": ["CSE 110", "MAT 117", "CSE 180", "CSE 120"],
        "Sophomore": ["CSE 205", "CSE 240", "MAT 243", "CSE 220"],
        "Junior": ["CSE 310", "CSE 360", "CSE 365", "CSE 340"],
        "Senior": ["CSE 410", "CSE 445", "CSE 450", "CSE 460"]
    },
    "Engineering": {
        "Freshman": ["FSE 100", "MAE 102", "EEE 120", "MAE 111"],
        "Sophomore": ["MAE 213", "EEE 202", "EGR 220", "MAE 212"],
        "Junior": ["MAE 241", "EEE 330", "MAE 340", "EGR 335"],
        "Senior": ["MAE 400", "EEE 452", "MAE 441", "MAE 460"]
    },
    "Business": {
        "Freshman": ["WPC 101", "COM 100", "ECN 110", "ACC 201"],
        "Sophomore": ["ECN 211", "WPC 247", "COM 230", "ACC 212"],
        "Junior": ["WPC 347", "FIN 300", "MGT 300", "MKT 302"],
        "Senior": ["MGT 400", "WPC 451", "FIN 402", "MKT 450"]
    },
    "Physics": {
        "Freshman": ["PHY 121", "PHY 131", "MAT 170", "PHY 100"],
        "Sophomore": ["PHY 202", "PHY 252", "PHY 201", "MAT 210"],
        "Junior": ["PHY 314", "PHY 301", "PHY 360", "PHY 342"],
        "Senior": ["PHY 452", "PHY 462", "PHY 498", "PHY 480"]
    },
    "Biology": {
        "Freshman": ["BIO 100", "BIO 160", "CHM 101", "MAT 117"],
        "Sophomore": ["BIO 182", "BIO 202", "MIC 205", "BIO 230"],
        "Junior": ["BIO 320", "BIO 340", "BIO 351", "BIO 370"],
        "Senior": ["BIO 420", "BIO 440", "BIO 495", "BIO 480"]
    },
    "Chemistry": {
        "Freshman": ["CHM 113", "CHM 117", "MAT 170", "CHM 100"],
        "Sophomore": ["CHM 233", "CHM 234", "CHM 231", "CHM 235"],
        "Junior": ["CHM 453", "CHM 460", "CHM 341", "CHM 361"],
        "Senior": ["CHM 480", "CHM 495", "CHM 498", "CHM 482"]
    },
    "Other": {
        "Freshman": ["ASU 101", "ENG 101", "COM 100", "MAT 117"],
        "Sophomore": ["COM 263", "ENG 102", "HST 110", "MAT 210"],
        "Junior": ["MAT 265", "ENG 301", "SOC 300", "COM 310"],
        "Senior": ["ENG 410", "SOC 400", "HST 495", "PHI 498"]
    }
}

# Define the course ranges by year
course_ranges = {
    "Freshman": (4, 8),
    "Sophomore": (9, 15),
    "Junior": (16, 24),
    "Senior": (25, 30)
}

def apply_random_deviation(distribution, deviation=0.02):
    """Apply random ±2% deviation to each major's distribution."""
    adjusted_distribution = {}
    total_weight = 0

    for major, weight in distribution.items():
        adjustment = random.uniform(-deviation, deviation)
        new_weight = max(0, weight + adjustment)
        adjusted_distribution[major] = new_weight
        total_weight += new_weight

    normalized_distribution = {k: v / total_weight for k, v in adjusted_distribution.items()}
    return normalized_distribution

def generate_major(distribution):
    """Randomly select a major based on the given distribution."""
    return random.choices(
        population=list(distribution.keys()),
        weights=list(distribution.values()),
        k=1
    )[0]


def filter_courses_by_year(major_courses, year):
    """Filter courses based on the student's year level."""
    # Define the year ranges based on the course level (e.g., 100-199 for Freshman)
    year_ranges = {
        "Freshman": range(100, 200),
        "Sophomore": range(200, 300),
        "Junior": range(300, 400),
        "Senior": range(400, 500)
    }

    # Extract the course level using regex (e.g., "CSE 110" -> 110)
    def get_course_level(course):
        match = re.search(r'(\d{3})', course)
        return int(match.group(1)) if match else None

    # Filter courses based on the year level
    return [
        course for course in major_courses
        if get_course_level(course) in year_ranges.get(year, range(100, 500))
    ]

import re
import random

def filter_courses_by_level(major_courses, level_range):
    """Filter courses based on the level range (e.g., 100-199)."""
    def get_course_level(course):
        match = re.search(r'(\d{3})', course)
        return int(match.group(1)) if match else None

    return [course for course in major_courses if get_course_level(course) in level_range]

def distribute_courses_across_levels(filtered_courses, year):
    """Distribute courses across levels according to the student's year."""
    course_distribution = {
        "Freshman": [(100, 200)],
        "Sophomore": [(100, 200), (200, 300)],
        "Junior": [(100, 200), (200, 300), (300, 400)],
        "Senior": [(100, 200), (200, 300), (300, 400), (400, 500)]
    }

    levels = course_distribution[year]
    selected_courses = []

    # Add courses from each level
    for level_range in levels:
        level_courses = filter_courses_by_level(filtered_courses, range(*level_range))
        if level_courses:
            selected_courses.extend(random.sample(level_courses, min(3, len(level_courses))))

    return selected_courses

def generate_about_me():
    """Generate a short 'About Me' section using OpenAI API without names or gender pronouns."""
    messages = [
        {"role": "system", "content": "You are a helpful assistant creating a short bio for a student."},
        {"role": "user", "content": "Write a brief 1-3 line description of a student's hobbies and study method, avoiding any names or gender pronouns. Use a casual, friendly tone. Use a good amount of diversity for the activities. For the study method, use one of these: by using flashcards for quick recall, by creating detailed outlines of topics, with interactive quizzes and practice problems, by making digital notes with highlights, by summarizing topics into concise notes, with spaced repetition techniques, by explaining topics out loud to reinforce learning."}
    ]
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=500,
        temperature=0.9
    )
    return response['choices'][0]['message']['content'].strip()


def generate_profile(major_distribution):
    """Generate a random student profile with name-sex consistency."""
    # First, assign the sex
    sex = random.choice(["Male", "Female"])

    # Generate the first name based on the assigned sex
    if sex == "Male":
        first_name = fake.first_name_male()
    else:
        first_name = fake.first_name_female()

    last_name = fake.last_name()
    year = random.choice(list(course_ranges.keys()))  # Select the student's year
    major = generate_major(major_distribution)

    # Select the number of courses based on the student's year
    min_courses, max_courses = course_ranges[year]

    # Get the courses for the selected major, or fallback to "Other" courses
    major_courses = courses_data.get(major, courses_data.get("Other", []))

    # Distribute courses across levels based on the student's year
    courses_taken = distribute_courses_across_levels(major_courses, year)

    # If the number of courses is insufficient, add fallback courses
    fallback_courses = ["ASU 101", "ENG 102", "COM 263", "MAT 170"]
    while len(courses_taken) < min_courses:
        courses_taken.extend(fallback_courses)

    # Ensure the final course list matches the required number of courses
    num_courses = min(random.randint(min_courses, max_courses), len(courses_taken))
    courses_taken = random.sample(courses_taken, num_courses)

    # Assign a help course (70% chance) based on the major and year
    if random.random() < 0.7 and major in help_courses:
        help_class_options = help_courses[major].get(year, [])
        course_need_help = random.choice(help_class_options) if help_class_options else random.choice(courses_taken)
    else:
        course_need_help = random.choice(courses_taken)

    about_me = generate_about_me()

    # Create the profile dictionary
    profile = {
        "Name": f"{first_name} {last_name}",
        "Year": year,
        "Major": major,
        "Sex": sex,
        "Courses_Taken": courses_taken,
        "Course_Need_Help": course_need_help,
        "About me" : about_me
    }
    return profile

# Apply random deviation to the major distribution
adjusted_distribution = apply_random_deviation(base_distribution)

# Generate 1000 profiles with a progress bar
profiles = [generate_profile(adjusted_distribution) for _ in tqdm(range(5000), desc="Generating Profiles", unit="profile")]

# Save the profiles to a CSV file
df = pd.DataFrame(profiles)
df.to_csv('student_profiles.csv', index=False)

print("Generated 5000 student profiles and saved to student_profiles.csv")