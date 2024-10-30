import React, { useState, useEffect } from 'react';
import { collection, doc, addDoc, serverTimestamp, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { X } from 'lucide-react';
import './MessageModal.css';
import { auth, db } from './firebaseConfig';

const MessageModal = ({ onClose, matches }) => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (selectedConversation) {
            const q = query(
                collection(db, 'conversations', selectedConversation.id, 'messages'),
                orderBy('timestamp', 'asc')
            );
            const unsubscribe = onSnapshot(q, snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()));
            });
            return () => unsubscribe();
        }
    }, [selectedConversation]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && selectedConversation) {
            const messageData = {
                text: newMessage,
                sender: auth.currentUser ? auth.currentUser.uid : "unknown",
                timestamp: serverTimestamp(),
            };

            await addDoc(collection(db, 'conversations', selectedConversation.id, 'messages'), messageData);

            const conversationRef = doc(db, 'conversations', selectedConversation.id);
            await updateDoc(conversationRef, {
                lastMessage: newMessage,
                timestamp: serverTimestamp(),
            });

            setNewMessage("");
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
                    <div className="conversations-container">
                        <div className="conversation-list">
                            {matches.map((match) => (
                                <div
                                    key={match.id}
                                    className={`conversation-item ${selectedConversation?.id === match.id ? "active" : ""}`}
                                    onClick={() => setSelectedConversation(match)}
                                >
                                    <div className="avatar">
                                        {match.name[0]}
                                    </div>
                                    <div className="conversation-info">
                                        <h4 className="conversation-name">{match.name}</h4>
                                        <p className="conversation-last-message">{match.bio || "No bio available"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chat-window">
                        {/* Add chat window elements here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;