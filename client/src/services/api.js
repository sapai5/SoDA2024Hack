// src/services/api.js
const API_BASE_URL = 'http://localhost:5000'; // Update this based on your Flask server URL

export const findMatches = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/find_matches`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.matches;
    } catch (error) {
        console.error('Error finding matches:', error);
        throw error;
    }
};

export const createConversation = async (userId, matchId) => {
    // You'll need to implement this endpoint in your Flask backend
    try {
        const conversationId = `${userId}_${matchId}`;
        return {
            id: conversationId,
            participants: [userId, matchId]
        };
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
};