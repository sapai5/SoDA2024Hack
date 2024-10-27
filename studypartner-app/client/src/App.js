import React, { useState, useEffect } from 'react';
import { User, MessageSquare, X, Check, Send } from 'lucide-react';
import axios from 'axios';
import './App.css';
import ProfileCard from './Profile';
import AuthPage from './AuthPage';
import ProfileModal from './ProfileModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001'; // Note: Using 5001 for Flask

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        name: 'Brandon Lim',
        year: 'Freshman',
        major: 'Computer Science',
        sex: 'm/f',
        courses_taken: 'courses taken',
        course_help: 'course help',
        about_me: 'hi bio',
        optIn: true,
    });
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [matches, setMatches] = useState([]);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleLogin = (credentials) => {
        console.log('Login:', credentials);
        setIsAuthenticated(true);
    };

    const handleRegister = (userData) => {
        console.log('Register:', userData);
        setIsAuthenticated(true);
    };

    const handleSaveProfile = async (updatedProfile) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/profile`, updatedProfile);

            if (response.data.success) {
                setSaveStatus('Profile saved successfully!');
                setCurrentUser(updatedProfile);
                await fetchMatches();

                setTimeout(() => {
                    setSaveStatus('');
                    setIsProfileOpen(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setSaveStatus(`Error: ${error.response?.data?.message || 'Failed to save profile'}`);
        }
    };

    // New optimized fetchMatches function
    const fetchMatches = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/matches`);
            const matchData = response.data;

            if (matchData && Array.isArray(matchData)) {
                // Set only to profiles, start with empty matches
                setProfiles(matchData);
                setMatches([]); // Start with empty matches

                if (matchData.length > 0) {
                    setCurrentProfile(matchData[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchMatches();
        }
    }, [isAuthenticated]);

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            {!isAuthenticated ? (
                <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
            ) : (
                <StudyApp
                    currentUser={currentUser}
                    onOpenProfile={() => setIsProfileOpen(true)}
                    fetchMatches={fetchMatches}
                    profiles={profiles}
                    matches={matches}
                    currentProfile={currentProfile}
                    setCurrentProfile={setCurrentProfile}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    setProfiles={setProfiles}
                    setMatches={setMatches}
                />
            )}
            {isProfileOpen && (
                <ProfileModal
                    user={currentUser}
                    onClose={() => setIsProfileOpen(false)}
                    onSave={handleSaveProfile}
                    saveStatus={saveStatus}
                />
            )}
        </div>
    );
};

const StudyApp = ({
                      currentUser,
                      onOpenProfile,
                      fetchMatches,
                      profiles,
                      matches,
                      currentProfile,
                      setCurrentProfile,
                      currentIndex,
                      setCurrentIndex,
                      setProfiles,
                      setMatches
                  }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');

    const handleSwipe = (direction) => {
        if (currentIndex >= profiles.length) return;

        if (direction === 'right' && currentProfile) {
            // Only add to matches if it's not already there
            setMatches((prev) => {
                // Check if profile is already in matches
                const isAlreadyMatched = prev.some(match => match._id === currentProfile._id);
                if (!isAlreadyMatched) {
                    return [...prev, currentProfile];
                }
                return prev;
            });

            setMessages((prev) => ({
                ...prev,
                [currentProfile._id]: []
            }));
        }

        setCurrentIndex((prevIndex) => prevIndex + 1);
        if (currentIndex + 1 < profiles.length) {
            setCurrentProfile(profiles[currentIndex + 1]);
        } else {
            setCurrentProfile(null);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (!isModalOpen && matches.length > 0) {
            setSelectedMatch(matches[0]);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedMatch) return;

        setMessages((prev) => ({
            ...prev,
            [selectedMatch._id]: [
                ...(prev[selectedMatch._id] || []),
                {
                    id: Date.now(),
                    text: newMessage,
                    sender: 'user',
                    timestamp: new Date().toISOString()
                }
            ]
        }));
        setNewMessage('');
    };

    const MessageModal = ({ onClose }) => (
        <div className="fixed inset-0 modal-overlay bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="profile-enter bg-white text-black rounded-lg w-full max-w-4xl h-[600px] flex">
                <div className="w-1/3 border-r border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Matches</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {matches.map((match) => (
                            <div
                                key={match._id}
                                onClick={() => setSelectedMatch(match)}
                                className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 
                                    ${selectedMatch?._id === match._id ? 'bg-blue-50' : ''}`}
                            >
                                <div className="p-2 bg-blue-100 rounded-full mr-3">
                                    <User size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium">{match.Name}</h3>
                                    <p className="text-sm">{match.Major}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-2/3 flex flex-col">
                    {selectedMatch ? (
                        <>
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="font-bold">{selectedMatch.Name}</h3>
                                <p className="text-sm">{selectedMatch.Major}</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages[selectedMatch._id]?.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 text-black">
                                            <p>{message.text}</p>
                                            <p className="text-xs opacity-75 mt-1">
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a match to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">GroupNet</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onOpenProfile}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </button>
                    <button
                        onClick={toggleModal}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                        <MessageSquare size={20} />
                        <span>Messages ({matches.length})</span>
                    </button>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    {currentProfile ? (
                        <div className="profile-enter bg-white rounded-lg shadow-lg p-6">
                            <ProfileCard profile={{
                                name: currentProfile.Name,
                                university: "University",
                                major: currentProfile.Major,
                                interests: currentProfile.Courses_Taken?.split(', ') || [],
                                bio: currentProfile['About me']
                            }} />
                            <div className="flex justify-center space-x-4 mt-6">
                                <button
                                    onClick={() => handleSwipe('left')}
                                    className="swipe-button flex items-center space-x-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                >
                                    <X size={20} />
                                    <span>Pass</span>
                                </button>
                                <button
                                    onClick={() => handleSwipe('right')}
                                    className="swipe-button flex items-center space-x-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                >
                                    <Check size={20} />
                                    <span>Connect</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-enter bg-white rounded-lg shadow-lg p-6 text-center">
                            <p className="text-xl text-gray-600">No more profiles available. Try updating your profile!</p>
                        </div>
                    )}
                </div>

                <div className="md:col-span-1 rounded-lg shadow-lg p-6 bg-white">
                    <h2 className="text-xl font-semibold mb-4">Your Matches ({matches.length})</h2>
                    <div className="space-y-4">
                        {matches.map((match) => (
                            <div
                                key={match._id}
                                onClick={() => {
                                    setSelectedMatch(match);
                                    setIsModalOpen(true);
                                }}
                                className="match-item flex items-center space-x-4 p-4 bg-gray-50 rounded-lg cursor-pointer"
                            >
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <User size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium">{match.Name}</h3>
                                    <p className="text-sm">{match.Major}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && <MessageModal onClose={toggleModal} />}
        </div>
    );
};

export default App;