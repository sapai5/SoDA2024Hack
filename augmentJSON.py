import json
from collections import defaultdict

# Load the original JSON file with course codes
with open(r"C:\Users\sahil\PycharmProjects\matchASU\scrape.json", "r") as f:
    courses = json.load(f)

# Define prefix patterns for each major
majors = {
    "Computer Science": ["CSE", "CPI", "DAT", "IFT"],
    "Business": ["ACC", "FIN", "MGT", "MKT", "WPC", "COM", "ECN"],
    "Biology": ["BIO", "BCH", "MBB", "MIC"],
    "Engineering": ["EEE", "MAE", "EGR", "FSE", "IEE"],
    "Art and Design": ["ART", "ARS", "GRA", "DCE"],
    "Mathematics": ["MAT", "STP"],
    "Chemistry": ["CHM", "BCH"],
    "Physics": ["PHY", "AST"],
    "Education": ["EDU", "EED", "SPE", "ENG"],
    "Law and Justice": ["CRJ", "LAW", "JUS"],
    "Languages": ["SPA", "FRE", "GER", "JPN"],
    "Miscellaneous": []  # Default group for uncategorized courses
}

# Initialize a dictionary to store categorized courses
categorized_courses = defaultdict(list)

# Categorize each course based on its prefix
for course in courses:
    found = False
    for major, prefixes in majors.items():
        if any(course.startswith(prefix) for prefix in prefixes):
            categorized_courses[major].append(course)
            found = True
            break
    if not found:
        categorized_courses["Miscellaneous"].append(course)

# Save the categorized courses to a new JSON file
with open("structured_courses.json", "w") as f:
    json.dump(categorized_courses, f, indent=4)

print("The courses have been categorized and saved to structured_courses.json")
