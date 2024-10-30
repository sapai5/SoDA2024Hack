import React from 'react';
import { User } from 'lucide-react';

const ProfileCard = ({ profile }) => {
    return (
        <div className="flex flex-col">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-blue-100 rounded-full">
                    <User size={48} className="text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-gray-600">{profile.university}</p>
                </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Major</h3>
                    <p className="text-gray-700">{profile.major}</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                            >
                {interest}
              </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Bio</h3>
                    <p className="text-gray-700">{profile.bio}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;