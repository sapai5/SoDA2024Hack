from pymongo import MongoClient
from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
import numpy as np

# MongoDB Connection
client = MongoClient("mongo-uri")
db = client['sapai1']  # Replace with actual database name
collection = db['studentsDB']  # Replace with actual collection name

# Step 3: Fetch and Filter Profiles
course_needed = "MAE 213"  # Course to match on
profiles = list(collection.find({"Course_Need_Help": course_needed}))

# Step 4: Preprocess Data

# Encode Year (e.g., Freshman=0, Sophomore=1, etc.)
year_encoder = LabelEncoder()
years = [profile['Year'] for profile in profiles]
year_encoded = year_encoder.fit_transform(years)

# Encode Courses_Taken as Binary Vector
all_courses = set(course for profile in profiles for course in eval(profile['Courses_Taken']))
mlb = MultiLabelBinarizer(classes=sorted(all_courses))
courses_taken_encoded = mlb.fit_transform([eval(profile['Courses_Taken']) for profile in profiles])

# Encode About Me with TF-IDF
about_me_texts = [profile['About me'] for profile in profiles]
tfidf_vectorizer = TfidfVectorizer(max_features=100)  # Limit features to avoid high dimensionality
about_me_encoded = tfidf_vectorizer.fit_transform(about_me_texts).toarray()

# Combine Year, Courses_Taken, and About Me features
features = np.column_stack((year_encoded, courses_taken_encoded, about_me_encoded))

# Step 5: Apply KNN to Find Matches
knn = NearestNeighbors(n_neighbors=20, metric='cosine').fit(features)
distances, indices = knn.kneighbors(features)

# Retrieve IDs of Matches for the first profile as an example
matches = [{'_id': profiles[i]['_id'], 'Name': profiles[i]['Name']} for i in indices[0]]

print("20 Nearest Matches for first user needing help in MAE 213:", matches)
