import React, { useState, useEffect } from 'react';
import Button from './components/ui/button';
import MessageModal from './components/MessageModal';
import Card from './components/ui/card';
import Profile from './Profile';
import { db } from './components/firebaseConfig';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { User, MessageSquare } from 'lucide-react';

const profiles = [
    { id: 1, name: "Alex Kim", university: "Stanford University", subjects: ["CS", "Math", "AI"], courses: ["CS224N", "CS229"], studyStyle: "Group discussions", availability: "Evenings" },
    { id: 2, name: "Sarah Chen", university: "MIT", subjects: ["Physics", "Engineering"], courses: ["6.001", "8.01"], studyStyle: "Problem-solving", availability: "Mornings" },
    { id: 3, name: "Michael Lee", university: "Harvard", subjects: ["Economics"], courses: ["ECON101"], studyStyle: "Solo sessions", availability: "Weekends" },
];

const StudyApp = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matches, setMatches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(null);

    useEffect(() => {
        console.log(`Displaying profile index: ${currentIndex}`, profiles[currentIndex]);
    }, [currentIndex]);

    const startConversationWithMatch = async (match) => {
        const q = query(collection(db, 'conversations'), where('participants', 'array-contains', match.id));
        const existingConversations = await getDocs(q);

        let conversationId;
        if (!existingConversations.empty) {
            conversationId = existingConversations.docs[0].id;
        } else {
            const newConversationRef = doc(collection(db, 'conversations'));
            await setDoc(newConversationRef, {
                participants: [match.id, 'currentUser'],
                name: match.name,
                lastMessage: '',
                timestamp: null,
            });
            conversationId = newConversationRef.id;
        }
        setSelectedConversation({ id: conversationId, ...match });
        setIsModalOpen(true);
    };

    const handleSwipe = (direction) => {
        console.log(`Swiped ${direction} on ${profiles[currentIndex].name}`);
        if (direction === 'right') {
            setMatches((prev) => [...prev, profiles[currentIndex]]);
        }
        setCurrentIndex((prevIndex) => {
            const newIndex = prevIndex + 1;
            return newIndex < profiles.length ? newIndex : prevIndex; // Stop incrementing if no profiles left
        });
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">StudyMatch</h1>
                    <Button variant="outline" className="flex items-center gap-2" onClick={toggleModal}>
                        <MessageSquare className="h-4 w-4" />
                        Messages
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4">
                <div className="flex gap-8">
                    <div className="flex-1 flex justify-center items-center">
                        {currentIndex < profiles.length ? (
                            <Profile profile={profiles[currentIndex]} onSwipe={handleSwipe} />
                        ) : (
                            <Card className="p-6 text-center">
                                <p>No more profiles to show!</p>
                            </Card>
                        )}
                    </div>

                    <div className="w-80">
                        <Card className="p-4">
                            <h2 className="text-xl font-bold mb-4">Your Matches ({matches.length})</h2>
                            <div className="space-y-4">
                                {matches.map((match) => (
                                    <div
                                        key={match.id}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        onClick={() => startConversationWithMatch(match)}
                                    >
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <User className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{match.name}</p>
                                            <p className="text-sm text-gray-500">{match.university}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <MessageModal onClose={toggleModal} initialConversation={selectedConversation} />
            )}
        </div>
    );
};

export default StudyApp;
