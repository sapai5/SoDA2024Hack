from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
import numpy as np
from bson import ObjectId
import os

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGODB_URI = os.getenv('MONGODB_URI',
                        'URI')
DB_NAME = os.getenv('DB_NAME', 'sapai1')
COLLECTION_NAME = os.getenv('COLLECTION_NAME', 'studentsDB')

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]


def find_matches(user_profile):
    """
    Find matches based on user profile using the existing matching logic
    """
    # Fetch Profiles with the same course needed help
    course_needed = user_profile["course_help"]
    profiles = list(collection.find({"Course_Need_Help": course_needed}))

    # Add user's profile temporarily for feature processing
    profiles.append({
        'Year': user_profile['year'],
        'Courses_Taken': user_profile['courses_taken'],
        'About me': user_profile['about_me'],
        'Sex': user_profile['sex']
    })

    # Encode Year
    year_encoder = LabelEncoder()
    years = [profile['Year'] for profile in profiles]
    year_encoded = year_encoder.fit_transform(years)

    # Encode Courses_Taken
    all_courses = set(course for profile in profiles for course in profile['Courses_Taken'].split(', '))
    mlb = MultiLabelBinarizer(classes=sorted(all_courses))
    courses_taken_encoded = mlb.fit_transform([profile['Courses_Taken'].split(', ') for profile in profiles])

    # Encode About Me
    about_me_texts = [profile['About me'] for profile in profiles]
    tfidf_vectorizer = TfidfVectorizer(max_features=100)
    about_me_encoded = tfidf_vectorizer.fit_transform(about_me_texts).toarray()

    # Encode Sex
    sex_encoder = LabelEncoder()
    sexes = [profile['Sex'] for profile in profiles]
    sex_encoded = sex_encoder.fit_transform(sexes)

    # Remove user's profile for matching
    profiles = profiles[:-1]
    year_encoded = year_encoded[:-1]
    courses_taken_encoded = courses_taken_encoded[:-1]
    about_me_encoded = about_me_encoded[:-1]
    sex_encoded = sex_encoded[:-1]

    # Combine features
    features = np.column_stack((year_encoded, courses_taken_encoded, about_me_encoded, sex_encoded))

    # Prepare user profile data
    user_year_encoded = year_encoder.transform([user_profile['year']])[0]
    user_courses_encoded = mlb.transform([user_profile['courses_taken'].split(', ')])[0]
    user_about_me_encoded = tfidf_vectorizer.transform([user_profile['about_me']]).toarray()[0]
    user_sex_encoded = sex_encoder.transform([user_profile['sex']])[0]

    user_features = np.hstack(
        (user_year_encoded, user_courses_encoded, user_about_me_encoded, user_sex_encoded)).reshape(1, -1)

    # Separate profiles by gender
    male_indices = [i for i, profile in enumerate(profiles) if profile['Sex'] == 'Male']
    female_indices = [i for i, profile in enumerate(profiles) if profile['Sex'] == 'Female']

    # Apply KNN
    matches = []

    if male_indices:
        male_features = features[male_indices]
        knn_male = NearestNeighbors(n_neighbors=min(len(male_features), 5), metric='cosine').fit(male_features)
        distances_male, indices_male = knn_male.kneighbors(user_features)
        male_matches = [profiles[male_indices[i]] for i in indices_male[0]]
        matches.extend(male_matches)

    if female_indices:
        female_features = features[female_indices]
        knn_female = NearestNeighbors(n_neighbors=min(len(female_features), 5), metric='cosine').fit(female_features)
        distances_female, indices_female = knn_female.kneighbors(user_features)
        female_matches = [profiles[female_indices[i]] for i in indices_female[0]]
        matches.extend(female_matches)

    return matches


@app.route('/api/profile', methods=['POST'])
def save_profile():
    try:
        profile_data = request.json
        result = collection.insert_one(profile_data)
        return jsonify({'success': True, 'id': str(result.inserted_id)})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/profiles/bulk', methods=['POST'])
def get_profiles_bulk():
    try:
        profile_ids = request.json['ids']
        # Convert string IDs to ObjectId
        object_ids = [ObjectId(pid) for pid in profile_ids]

        # Fetch all profiles in one query
        profiles = list(collection.find({'_id': {'$in': object_ids}}))

        # Convert ObjectIds to strings for JSON serialization
        for profile in profiles:
            profile['_id'] = str(profile['_id'])

        return jsonify(profiles)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/matches', methods=['GET'])
def get_matches():
    try:
        matches = list(collection.find({}))
        # Include full profile data in the matches response
        for match in matches:
            match['_id'] = str(match['_id'])
        return jsonify(matches)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/find-matches', methods=['POST'])
def find_matches_endpoint():
    try:
        user_profile = request.json
        matches = find_matches(user_profile)
        # Convert ObjectId to string for JSON serialization
        for match in matches:
            match['_id'] = str(match['_id'])
        return jsonify(matches)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)