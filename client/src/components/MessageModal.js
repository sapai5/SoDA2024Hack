import React, { useState, useEffect } from 'react';
import { collection, doc, addDoc, serverTimestamp, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { X } from 'lucide-react';
import './MessageModal.css';
import { auth, db } from './firebaseConfig';

const MessageModal = ({ onClose, matches }) => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);

    // Fetch messages for the selected match in real-time
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
                sender: auth.currentUser.uid,
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
                        <X className="icon" />
                    </button>
                </div>
                <div className="modal-body">
                    {/* Left Panel: Matches List */}
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
                                <span className="status-dot"></span>
                            </div>
                        ))}
                    </div>

                    {/* Right Panel: Chat Window */}
                    <div className="chat-window">
                        {selectedConversation ? (
                            <>
                                <div className="chat-header">
                                    <h3>{selectedConversation.name}</h3>
                                </div>
                                <div className="chat-messages">
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`message ${msg.sender === auth.currentUser.uid ? "sent" : "received"}`}>
                                            <p>{msg.text}</p>
                                            <span className="message-time">
                                                {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-input">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="message-input"
                                    />
                                    <button onClick={handleSendMessage} className="send-button">Send</button>
                                </div>
                            </>
                        ) : (
                            <p className="select-conversation">Select a conversation to start chatting</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;