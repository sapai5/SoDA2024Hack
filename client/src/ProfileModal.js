import React, { useState } from 'react';
import { X } from 'lucide-react';
import './ProfileModal.css';

const ProfileModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        major: user.major || '',
        interests: user.interests || '',
        bio: user.bio || '',
        optIn: user.optIn || false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 modal-overlay bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 text-white rounded-lg p-6 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Major</label>
                        <input
                            type="text"
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Interests (comma separated)</label>
                        <input
                            type="text"
                            name="interests"
                            value={formData.interests}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            rows="3"
                        ></textarea>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="optIn"
                            checked={formData.optIn}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label>Opt-in to receive communications</label>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full mt-6 p-2 bg-pink-500 rounded hover:bg-pink-600 transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default ProfileModal;
