import React, { useState, useEffect } from 'react';
import { User, MessageSquare, X, Check, Send, Moon, Sun } from 'lucide-react';
import './App.css';
import sampleProfiles from './sampleProfiles';
import ProfileCard from './Profile';
import AuthPage from './AuthPage';
import ProfileModal from './ProfileModal';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState({
        name: 'Brandon Lim',
        email: 'brandonlim@example.com',
        major: 'Computer Science',
        interests: 'Coding, Music, Sports',
        bio: 'Just a tech enthusiast!',
        optIn: true,
    });

    const handleLogin = (credentials) => {
        console.log('Login:', credentials);
        setIsAuthenticated(true);
    };

    const handleRegister = (userData) => {
        console.log('Register:', userData);
        setIsAuthenticated(true);
    };

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    const handleSaveProfile = (updatedProfile) => {
        setUser(updatedProfile);
        setIsProfileOpen(false);
    };

    return (
        <div className={isDarkMode ? 'dark-mode' : ''}>
            {!isAuthenticated ? (
                <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
            ) : (
                <StudyApp
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    user={user}
                    onOpenProfile={() => setIsProfileOpen(true)}
                />
            )}
            {isProfileOpen && (
                <ProfileModal
                    user={user}
                    onClose={() => setIsProfileOpen(false)}
                    onSave={handleSaveProfile}
                />
            )}
        </div>
    );
};

const StudyApp = ({ isDarkMode, toggleDarkMode, user, onOpenProfile }) => {
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matches, setMatches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        setProfiles(sampleProfiles);
    }, []);

    useEffect(() => {
        if (profiles.length > 0 && currentIndex < profiles.length) {
            setCurrentProfile(profiles[currentIndex]);
        } else {
            setCurrentProfile(null);
        }
    }, [profiles, currentIndex]);

    const handleSwipe = (direction) => {
        if (currentIndex >= profiles.length) return;

        if (direction === 'right' && currentProfile) {
            setMatches((prev) => [...prev, currentProfile]);
            setMessages((prev) => ({
                ...prev,
                [currentProfile.id]: []
            }));
        }

        setCurrentIndex((prevIndex) => prevIndex + 1);
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
            [selectedMatch.id]: [
                ...(prev[selectedMatch.id] || []),
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
            <div className={`profile-enter ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg w-full max-w-4xl h-[600px] flex`}>
                <div className={`w-1/3 border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Matches</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {matches.map((match) => (
                            <div
                                key={match.id}
                                onClick={() => setSelectedMatch(match)}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                                    selectedMatch?.id === match.id
                                        ? 'bg-blue-50 border-blue-500'
                                        : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className="p-2 bg-blue-100 rounded-full mr-3">
                                    <User size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium">{match.name}</h3>
                                    <p className="text-sm">{match.university}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-2/3 flex flex-col">
                    {selectedMatch ? (
                        <>
                            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <h3 className="font-bold">{selectedMatch.name}</h3>
                                <p className="text-sm">{selectedMatch.major}</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages[selectedMatch.id]?.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] rounded-lg p-3 ${
                                            message.sender === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                                        }`}>
                                            <p>{message.text}</p>
                                            <p className="text-xs opacity-75 mt-1">
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSendMessage} className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className={`flex-1 p-2 rounded-lg focus:outline-none ${
                                            isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'border-gray-300'
                                        }`}
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
        <div className="min-h-screen bg-gray-100 dark:bg-[#1e1e1e] dark:text-[#e0e0e0]">
            <div className="container mx-auto px-4 py-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#ffffff]">GroupNet</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleDarkMode} className="text-white">
                            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                        </button>
                        <button
                            onClick={onOpenProfile}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                        >
                            Profile
                        </button>
                        <button
                            onClick={toggleModal}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            <MessageSquare size={20} />
                            <span>Messages</span>
                        </button>
                    </div>
                </header>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        {currentProfile ? (
                            <div className={`profile-enter rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                                <ProfileCard profile={currentProfile} />
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
                                <p className="text-xl text-gray-600">No more profiles to show!</p>
                            </div>
                        )}
                    </div>

                    <div className={`md:col-span-1 rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                        <h2 className="text-xl font-semibold mb-4">Your Matches ({matches.length})</h2>
                        <div className="space-y-4">
                            {matches.map((match, index) => (
                                <div
                                    key={`${match.id}-${index}`}
                                    onClick={() => {
                                        setSelectedMatch(match);
                                        setIsModalOpen(true);
                                    }}
                                    className={`match-item flex items-center space-x-4 p-4 rounded-lg cursor-pointer ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                                >
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <User size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{match.name}</h3>
                                        <p className="text-sm">{match.university}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {isModalOpen && <MessageModal onClose={toggleModal} />}
            </div>
        </div>
    );
};

export default App;
