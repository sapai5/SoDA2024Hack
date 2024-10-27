import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const ProfileModal = ({ user, onClose, onSave, saveStatus }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        year: user.year || '',
        major: user.major || '',
        sex: user.sex || '',
        courses_taken: user.courses_taken || '',
        course_help: user.course_help || '',
        about_me: user.about_me || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] relative">
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 4rem)' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Edit Profile</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {saveStatus && (
                        <div className={`mb-4 p-3 rounded ${
                            saveStatus.includes('Error')
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                        }`}>
                            {saveStatus}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Year</label>
                            <input
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Major</label>
                            <input
                                type="text"
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Sex</label>
                            <input
                                type="text"
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Courses Taken</label>
                            <input
                                type="text"
                                name="courses_taken"
                                value={formData.courses_taken}
                                onChange={handleChange}
                                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Courses You Can Help With</label>
                            <input
                                type="text"
                                name="course_help"
                                value={formData.course_help}
                                onChange={handleChange}
                                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">About Me</label>
                            <textarea
                                name="about_me"
                                value={formData.about_me}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </form>
                </div>

                <div className="p-6 pt-0">
                    <button
                        onClick={handleSubmit}
                        className="w-full flex items-center justify-center py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200"
                    >
                        <Save size={20} className="mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;