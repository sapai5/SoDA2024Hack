import React, { useState, useEffect, useRef } from 'react';
import { collection, doc, addDoc, serverTimestamp, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { X } from 'lucide-react';
import { findMatches } from '../services/api';
import { auth, db } from './firebaseConfig';

const MessageModal = ({ onClose, userData }) => {
    const [matches, setMatches] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch matches when component mounts
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`${API_BASE_URL}/api/find-matches`, {
                    name: userData.name,
                    course_needed: userData.courseNeeded,
                    about_me: userData.aboutMe,
                    courses_taken: userData.coursesTaken
                });

                setMatches(response.data);
            } catch (error) {
                setError('Failed to load matches');
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [userData]);

    // Listen for messages in selected conversation
    useEffect(() => {
        let unsubscribe = () => {};

        if (selectedConversation) {
            const q = query(
                collection(db, 'conversations', selectedConversation.id, 'messages'),
                orderBy('timestamp', 'asc')
            );

            unsubscribe = onSnapshot(q, snapshot => {
                const newMessages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMessages(newMessages);
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            });
        }

        return () => unsubscribe();
    }, [selectedConversation?.id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConversation) {
            const messageData = {
                text: newMessage,
                sender: auth.currentUser?.uid || "unknown",
                timestamp: serverTimestamp(),
                senderName: userData.name // Add sender's name
            };

            try {
                // Optimistic UI update
                setMessages(prev => [...prev, {
                    ...messageData,
                    id: Date.now(),
                    timestamp: new Date()
                }]);
                setNewMessage("");

                // Add message to Firestore
                await addDoc(
                    collection(db, 'conversations', selectedConversation.id, 'messages'),
                    messageData
                );

                // Update conversation metadata
                const conversationRef = doc(db, 'conversations', selectedConversation.id);
                await updateDoc(conversationRef, {
                    lastMessage: newMessage,
                    timestamp: serverTimestamp(),
                    lastSender: userData.name
                });
            } catch (error) {
                console.error('Error sending message:', error);
                setError('Failed to send message');
            }
        }
    };

    if (loading) {
        return <div className="modal-overlay">
            <div className="modal-content">
                <div className="flex items-center justify-center h-64">
                    <p>Loading matches...</p>
                </div>
            </div>
        </div>;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Messages</h2>
                    <button onClick={onClose} className="close-button">
                        <X className="icon"/>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="conversations-container overflow-y-auto max-h-96">
                        <div className="conversation-list">
                            {matches.map((match) => (
                                <div
                                    key={match._id}
                                    className={`conversation-item ${selectedConversation?.id === match._id ? "active" : ""}`}
                                    onClick={() => setSelectedConversation({
                                        id: match._id,
                                        name: match.Name
                                    })}
                                >
                                    <div className="avatar">
                                        {match.Name[0]}
                                    </div>
                                    <div className="conversation-info">
                                        <h4 className="conversation-name">{match.Name}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chat-window">
                        {selectedConversation ? (
                            <>
                                <div className="messages-container overflow-y-auto">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`message ${message.sender === (auth.currentUser?.uid || "unknown") ? "sent" : "received"}`}
                                        >
                                            <p>{message.text}</p>
                                            <span className="timestamp">
                                                {message.timestamp instanceof Date
                                                    ? message.timestamp.toLocaleTimeString()
                                                    : message.timestamp?.toDate().toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSendMessage} className="message-input-container">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="message-input"
                                    />
                                    <button type="submit" className="send-button">
                                        Send
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Select a conversation to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;