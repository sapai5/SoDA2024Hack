import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from 'react-use-gesture';
import { User, X, Check } from 'lucide-react';
import CardContent from './components/ui/cardContent';
import Button from './components/ui/button';
import Badge from './components/ui/badge';

const Profile = ({ profile, onSwipe }) => {
    const [swiped, setSwiped] = useState(false);

    useEffect(() => {
        setSwiped(false); // Reset swiped state when a new profile is loaded
    }, [profile]);

    const [{ x, rotation, scale, opacity }, api] = useSpring(() => ({
        x: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        config: { tension: 300, friction: 30 },
    }));

    const triggerSwipe = (direction) => {
        api.start({
            x: direction === 'right' ? 1000 : -1000,
            opacity: 0,
            onRest: () => {
                setSwiped(true);
                onSwipe(direction);
            },
        });
    };

    const bind = useDrag(({ down, movement: [mx], velocity, direction: [xDir] }) => {
        const trigger = velocity > 0.2;
        const dir = xDir > 0 ? 'right' : 'left';

        if (!down && trigger) {
            triggerSwipe(dir);
        } else {
            api.start({
                x: down ? mx : 0,
                rotation: down ? mx / 100 : 0,
                scale: down ? 1.1 : 1,
            });
        }
    });

    if (!profile || swiped) return null;

    return (
        <animated.div
            {...bind()}
            style={{
                x,
                transform: x.to((x) => `translateX(${x}px) rotate(${rotation}deg)`),
                scale,
                opacity,
            }}
            className="w-80 h-auto shadow-lg rounded-lg bg-white flex flex-col justify-between"
        >
            <CardContent className="p-6 flex-grow">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-8 w-8 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{profile.name || "Name not available"}</h3>
                        <p className="text-sm text-gray-500">{profile.university || "University not specified"}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-sm text-gray-700">{profile.bio || "No bio available"}</p>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Study Interests</h4>
                    <div className="flex flex-wrap gap-2">
                        {profile.studyInterests && profile.studyInterests.length > 0 ? (
                            profile.studyInterests.map((interest, index) => (
                                <Badge key={index} variant="secondary">{interest}</Badge>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No interests listed</p>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Current Courses</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                        {profile.currentCourses && profile.currentCourses.length > 0 ? (
                            profile.currentCourses.map((course, index) => (
                                <li key={index}>{course}</li>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No courses listed</p>
                        )}
                    </ul>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Study Style</h4>
                    <p className="text-sm text-gray-700">{profile.studyStyle || "Not specified"}</p>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Availability</h4>
                    <p className="text-sm text-gray-700">{profile.availability || "Not specified"}</p>
                </div>
            </CardContent>

            <div className="flex justify-around p-4 border-t border-gray-200">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-red-100 hover:bg-red-200"
                    onClick={() => triggerSwipe('left')}
                >
                    <X className="h-6 w-6 text-red-500" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-green-100 hover:bg-green-200"
                    onClick={() => triggerSwipe('right')}
                >
                    <Check className="h-6 w-6 text-green-500" />
                </Button>
            </div>
        </animated.div>
    );
};

export default Profile;
