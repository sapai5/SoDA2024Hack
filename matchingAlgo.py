from pymongo import MongoClient
from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
import numpy as np
import json

# Read in the JSON file containing your profile
with open('./profile.json') as f:
    user_profile = json.load(f)

# MongoDB Connection
client = MongoClient("MONGO URI")
db = client['sapai1']  # Replace with actual database name
collection = db['studentsDB']  # Replace with actual collection name

# Fetch Profiles (both male and female profiles included)
course_needed = user_profile["course_help"]  # Match based on the course you need help in
profiles = list(collection.find({"Course_Need_Help": course_needed}))

# Add user's profile to the profiles list temporarily for consistent encoding
profiles.append({
    'Year': user_profile['year'],
    'Courses_Taken': user_profile['courses_taken'],
    'About me': user_profile['about_me'],
    'Sex': user_profile['sex']
})

# Preprocess Data

# Encode Year (e.g., Freshman=0, Sophomore=1, etc.)
year_encoder = LabelEncoder()
years = [profile['Year'] for profile in profiles]
year_encoded = year_encoder.fit_transform(years)

# Encode Courses_Taken as Binary Vector
all_courses = set(course for profile in profiles for course in profile['Courses_Taken'].split(', '))
mlb = MultiLabelBinarizer(classes=sorted(all_courses))
courses_taken_encoded = mlb.fit_transform([profile['Courses_Taken'].split(', ') for profile in profiles])

# Encode About Me with TF-IDF
about_me_texts = [profile['About me'] for profile in profiles]
tfidf_vectorizer = TfidfVectorizer(max_features=100)  # Limit features to avoid high dimensionality
about_me_encoded = tfidf_vectorizer.fit_transform(about_me_texts).toarray()

# Add Sex as a feature (e.g., Male=0, Female=1)
sex_encoder = LabelEncoder()
sexes = [profile['Sex'] for profile in profiles]
sex_encoded = sex_encoder.fit_transform(sexes)

# Remove the last entry (user's profile) from profiles and encoded data for matching
profiles = profiles[:-1]
year_encoded = year_encoded[:-1]
courses_taken_encoded = courses_taken_encoded[:-1]
about_me_encoded = about_me_encoded[:-1]
sex_encoded = sex_encoded[:-1]

# Combine Year, Courses_Taken, About Me, and Sex features
features = np.column_stack((year_encoded, courses_taken_encoded, about_me_encoded, sex_encoded))

# Prepare user profile data for matching
user_year_encoded = year_encoder.transform([user_profile['year']])[0]
user_courses_encoded = mlb.transform([user_profile['courses_taken'].split(', ')])[0]
user_about_me_encoded = tfidf_vectorizer.transform([user_profile['about_me']]).toarray()[0]
user_sex_encoded = sex_encoder.transform([user_profile['sex']])[0]

# Stack user's profile features
user_features = np.hstack((user_year_encoded, user_courses_encoded, user_about_me_encoded, user_sex_encoded)).reshape(1, -1)

# Separate male and female profiles for balanced matching
male_indices = [i for i, profile in enumerate(profiles) if profile['Sex'] == 'Male']
female_indices = [i for i, profile in enumerate(profiles) if profile['Sex'] == 'Female']

# Apply KNN on male and female profiles separately
male_features = features[male_indices]
female_features = features[female_indices]

knn_male = NearestNeighbors(n_neighbors=min(len(male_features), 5), metric='cosine').fit(male_features)
distances_male, indices_male = knn_male.kneighbors(user_features)

knn_female = NearestNeighbors(n_neighbors=min(len(female_features), 5), metric='cosine').fit(female_features)
distances_female, indices_female = knn_female.kneighbors(user_features)

# Convert indices back to original profile indices
male_matches = [{'_id': profiles[male_indices[i]]['_id'], 'Name': profiles[male_indices[i]]['Name']} for i in indices_male[0]]
female_matches = [{'_id': profiles[female_indices[i]]['_id'], 'Name': profiles[female_indices[i]]['Name']} for i in indices_female[0]]

# Combine male and female matches, allowing a ±20% variance in ratio
matches = male_matches + female_matches
print("Balanced Matches for user profile:", matches)
