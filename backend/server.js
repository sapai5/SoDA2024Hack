require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB using the URI in the .env file
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define Profile schema and model
const profileSchema = new mongoose.Schema({
    name: String,
    university: String,
    subjects: [String],
    courses: [String],
    studyStyle: String,
    availability: String,
});

const Profile = mongoose.model('Profile', profileSchema);

// API route to fetch profiles
app.get('/api/profiles', async (req, res) => {
    try {
        const profiles = await Profile.find(); // Fetch all profiles from MongoDB
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profiles', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
