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
    const messageListenerRef = useRef(null); // Add ref for message listener

    // Fetch matches only once when component mounts
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
    }, []); // Remove userData from dependencies

    // Optimize message listener setup
    useEffect(() => {
        if (!selectedConversation) return;

        // Clean up previous listener
        if (messageListenerRef.current) {
            messageListenerRef.current();
        }

        const q = query(
            collection(db, 'conversations', selectedConversation.id, 'messages'),
            orderBy('timestamp', 'asc')
        );

        messageListenerRef.current = onSnapshot(q, snapshot => {
            const newMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(newMessages);
        });

        return () => {
            if (messageListenerRef.current) {
                messageListenerRef.current();
            }
        };
    }, [selectedConversation?.id]); // Only depend on conversation ID

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedMessage = newMessage.trim();
        if (!trimmedMessage || !selectedConversation) return;

        const messageData = {
            text: trimmedMessage,
            sender: auth.currentUser?.uid || "unknown",
            timestamp: serverTimestamp(),
            senderName: userData.name
        };

        try {
            setNewMessage(""); // Clear input immediately

            // Add message to Firestore
            await addDoc(
                collection(db, 'conversations', selectedConversation.id, 'messages'),
                messageData
            );

            // Update conversation metadata
            const conversationRef = doc(db, 'conversations', selectedConversation.id);
            await updateDoc(conversationRef, {
                lastMessage: trimmedMessage,
                timestamp: serverTimestamp(),
                lastSender: userData.name
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message');
        }
    };

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