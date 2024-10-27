import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for authentication if needed
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const saveProfile = async (profileData) => {
    try {
        const response = await api.post('/api/profile', profileData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to save profile');
    }
};

export const fetchMatches = async () => {
    try {
        const response = await api.get('/api/matches');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch matches');
    }
};

export const getProfileById = async (profileId) => {
    try {
        const response = await api.get(`/api/profile/${profileId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
};

export default api;