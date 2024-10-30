const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define the new output directory
const OUTPUT_DIR = 'C:\\Users\\brand\\PycharmProjects\\GroupNet';

// Route to handle profile JSON saving
app.post('/api/profile', async (req, res) => {
    try {
        const profileData = req.body;

        // Create the full path for profile.json
        const filePath = path.join(OUTPUT_DIR, 'profile.json');

        // Save the file
        await fs.writeFile(filePath, JSON.stringify(profileData, null, 2));

        // Log success
        console.log('Profile saved to:', filePath);

        res.json({
            success: true,
            message: 'Profile saved successfully',
            filePath: filePath
        });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save profile'
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Profiles will be saved in: ${OUTPUT_DIR}`);
});