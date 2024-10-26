import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, doc, addDoc, serverTimestamp, onSnapshot, orderBy, query } from 'firebase/firestore';
import { X } from 'lucide-react';
import './MessageModal.css';

const MessageModal = ({ onClose }) => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);

    // Fetch conversations from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'conversations'), snapshot => {
            setConversations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    // Fetch messages for the selected conversation in real-time
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

    // Select a sample user conversation by default
    useEffect(() => {
        if (conversations.length > 0 && !selectedConversation) {
            setSelectedConversation(conversations[0]); // Select the first conversation as default
        }
    }, [conversations, selectedConversation]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && selectedConversation) {
            await addDoc(collection(db, 'conversations', selectedConversation.id, 'messages'), {
                text: newMessage,
                sender: "self", // Mark this message as sent by the user
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
                    <div className="conversation-list">
                        {conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`conversation-item ${selectedConversation?.id === conversation.id ? "active" : ""}`}
                                onClick={() => setSelectedConversation(conversation)}
                            >
                                <div className="avatar">{conversation.name[0]}</div>
                                <div className="conversation-info">
                                    <h4 className="conversation-name">{conversation.name}</h4>
                                    <p className="conversation-last-message">{conversation.lastMessage}</p>
                                </div>
                                <span className="conversation-time">{conversation.time}</span>
                            </div>
                        ))}
                    </div>
                    <div className="chat-window">
                        {selectedConversation ? (
                            <>
                                <div className="chat-header">
                                    <h3>{selectedConversation.name}</h3>
                                </div>
                                <div className="chat-messages">
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`message ${msg.sender === 'self' ? "sent" : "received"}`}>
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