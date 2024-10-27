import React, { useState } from 'react';
import { User, Book, ChevronRight, ChevronLeft, Mail, Lock } from 'lucide-react';

const LoginForm = ({ onSwitch, onLogin }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(credentials);
    };

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Welcome to GroupNet</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                    Log In
                </button>
            </form>
            <p className="mt-4 text-center text-gray-600">
                Don't have an account?{' '}
                <button
                    onClick={onSwitch}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                >
                    Register
                </button>
            </p>
        </div>
    );
};

const RegistrationForm = ({ onSwitch, onRegister }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        year: '',
        major: '',
        sex: '',
        courses_taken: [],
        course_need_help: [],
        about_me: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
            return;
        }

        // Create profile object
        const profile = {
            Name: `${formData.first_name} ${formData.last_name}`,
            Year: formData.year,
            Major: formData.major,
            Sex: formData.sex,
            Courses_Taken: formData.courses_taken,
            Course_Need_Help: formData.course_need_help,
            "About me": formData.about_me
        };

        onRegister({ ...formData, profile });
    };

    const handleCourseInput = (field, value) => {
        // Split the comma-separated string into an array and trim whitespace
        const courses = value.split(',').map(course => course.trim());
        setFormData({ ...formData, [field]: courses });
    };

    const steps = {
        1: (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />
                </div>
            </div>
        ),
        2: (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            required
                        >
                            <option value="">Select Year</option>
                            <option value="Freshman">Freshman</option>
                            <option value="Sophomore">Sophomore</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                            <option value="Graduate">Graduate</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={formData.sex}
                            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                            required
                        >
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                        required
                    />
                </div>
            </div>
        ),
        3: (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Courses Taken (comma-separated)
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="e.g. CS101, MATH201, PHYS301"
                        value={formData.courses_taken.join(', ')}
                        onChange={(e) => handleCourseInput('courses_taken', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Courses Need Help With (comma-separated)
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="e.g. CS301, MATH401"
                        value={formData.course_need_help.join(', ')}
                        onChange={(e) => handleCourseInput('course_need_help', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg h-32"
                        value={formData.about_me}
                        onChange={(e) => setFormData({ ...formData, about_me: e.target.value })}
                        required
                    />
                </div>
            </div>
        )
    };

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
            <div className="mb-6">
                <div className="flex justify-center items-center space-x-4">
                    {[1, 2, 3].map((num) => (
                        <div
                            key={num}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step === num
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            {num}
                        </div>
                    ))}
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {steps[step]}
                <div className="flex justify-between">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                        >
                            <ChevronLeft size={20} />
                            <span>Back</span>
                        </button>
                    )}
                    <button
                        type="submit"
                        className="flex items-center space-x-2 ml-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                        <span>{step === 3 ? 'Create Account' : 'Next'}</span>
                        {step < 3 && <ChevronRight size={20} />}
                    </button>
                </div>
            </form>
            <p className="mt-4 text-center text-gray-600">
                Already have an account?{' '}
                <button
                    onClick={onSwitch}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                >
                    Log in
                </button>
            </p>
        </div>
    );
};

// Profile Card Component with enhanced styling and features
const ProfileCard = ({ profile }) => {
    return (
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6 border-b pb-6">
                <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full">
                    <User size={48} className="text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{profile.Name}</h2>
                    <div className="flex space-x-2 text-sm text-gray-600">
                        <span>{profile.Year}</span>
                        <span>•</span>
                        <span>{profile.Major}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Courses Taken</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.Courses_Taken.map((course, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                                >
                                    {course}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Need Help With</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.Course_Need_Help.map((course, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-sm"
                                >
                                    {course}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">About Me</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{profile["About me"]}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Keep the existing LoginForm, RegistrationForm, and AuthPage components as they are

// Modified AuthPage to include profile preview in registration
const AuthPage = ({ onLogin, onRegister }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [previewProfile, setPreviewProfile] = useState(null);

    const handleRegister = (formData) => {
        setPreviewProfile(formData.profile);
        onRegister(formData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {isLogin ? (
                <LoginForm onSwitch={() => setIsLogin(false)} onLogin={onLogin} />
            ) : (
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
                    <RegistrationForm onSwitch={() => setIsLogin(true)} onRegister={handleRegister} />
                    {previewProfile && (
                        <div className="w-full md:w-1/2">
                            <ProfileCard profile={previewProfile} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AuthPage;