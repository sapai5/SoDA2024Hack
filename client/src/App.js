import React, { useState, useEffect } from 'react';
import { User, MessageSquare, X, Check } from 'lucide-react';
import './App.css';

// Sample profile data
const sampleProfiles = [
    {
        id: 1,
        name: "Alex Johnson",
        university: "Stanford University",
        major: "Computer Science",
        interests: ["Machine Learning", "Web Development", "Algorithms"],
        bio: "Looking for study partners in advanced algorithms and ML projects."
    },
    {
        id: 2,
        name: "Sarah Chen",
        university: "MIT",
        major: "Physics",
        interests: ["Quantum Mechanics", "Mathematics", "Programming"],
        bio: "Passionate about quantum computing and theoretical physics."
    },
    {
        id: 3,
        name: "Michael Brown",
        university: "Berkeley",
        major: "Data Science",
        interests: ["Big Data", "Statistics", "Python"],
        bio: "Seeking collaborators for data science projects and study groups."
    }
];

const StudyApp = () => {
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matches, setMatches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(null);

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
            setMatches(prev => [...prev, currentProfile]);
        }

        setCurrentIndex(prevIndex => prevIndex + 1);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Profile Card Component
    const ProfileCard = ({ profile }) => (
        <div className="profile-enter bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                    <User size={40} className="text-blue-600" />
                </div>
            </div>
            <div className="text-center">
                <h2 className="text-xl font-bold mb-2">{profile.name}</h2>
                <p className="text-gray-600 mb-2">{profile.university}</p>
                <p className="text-gray-700 mb-4">{profile.major}</p>
                <p className="text-gray-600 mb-4">{profile.bio}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {profile.interests.map((interest, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                            {interest}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );

    // Message Modal Component
    const MessageModal = ({ onClose }) => (
        <div className="fixed inset-0 modal-overlay bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="profile-enter bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Messages</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <div className="text-center text-gray-600 py-8">
                    No messages yet
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">GroupNet</h1>
                    <button
                        onClick={toggleModal}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                        <MessageSquare size={20} />
                        <span>Messages</span>
                    </button>
                </header>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        {currentProfile ? (
                            <div className="profile-enter bg-white rounded-lg shadow-lg p-6">
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

                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Your Matches ({matches.length})
                            </h2>
                            <div className="space-y-4">
                                {matches.map((match, index) => (
                                    <div
                                        key={`${match.id}-${index}`}
                                        className="match-item flex items-center space-x-4 p-4 bg-gray-50 rounded-lg cursor-pointer"
                                    >
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <User size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{match.name}</h3>
                                            <p className="text-sm text-gray-600">{match.university}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {isModalOpen && <MessageModal onClose={toggleModal} />}
            </div>
        </div>
    );
};

export default StudyApp;