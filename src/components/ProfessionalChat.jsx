import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Chat.css";
import NavBarProfessional from "./NavBarProfessional";

const ProfessionalChat = () => {
    const { userId } = useParams();  // Get the userId from URL
    const [professionalId, setProfessionalId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [userName, setUserName] = useState("User");

    // Retrieve professional ID from localStorage
    useEffect(() => {
        const storedProfessional = localStorage.getItem("user");
        if (storedProfessional) {
            try {
                const parsedProfessional = JSON.parse(storedProfessional);
                setProfessionalId(parsedProfessional._id);
            } catch (error) {
                console.error("Error parsing professional data:", error);
            }
        } else {
            console.error("Professional data not found in localStorage!");
        }
    }, []);

    // Fetch user details
    useEffect(() => {
        if (!userId) return;

        axios.get(`http://localhost:8080/users/${userId}`)
            .then(response => {
                if (response.data && response.data.fullName) {
                    setUserName(response.data.fullName);
                } else {
                    console.warn("No user name found!");
                }
            })
            .catch(error => console.error("Error fetching user details:", error));
    }, [userId]);

    // Fetch chat history
    const fetchMessages = async () => {
        if (!professionalId || !userId) return;

        try {
            const response = await axios.get(`http://localhost:8080/messages/${professionalId}/${userId}`);
            if (response.data) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();

        // Auto-refresh messages every 5 seconds (can be replaced with WebSockets)
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval); // Cleanup on unmount
    }, [professionalId, userId]);

    // Send a new message
    const sendMessage = async () => {
        if (!newMessage.trim() || !professionalId) return;

        try {
            const response = await axios.post("http://localhost:8080/send-message", {
                senderId: professionalId,
                receiverId: userId,
                message: newMessage.trim(),
                timestamp: new Date(),
                status: "sent"
            });

            if (response.data && response.data.message) {
                setMessages(prev => [...prev, response.data.message]); // Append new message
            }

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="chat-page">
            <NavBarProfessional />
            <div className="chat-container">
                <h2>Chat with {userName}</h2>
                <div className="chat-box">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div key={msg._id || index} className={`message-container ${msg.senderId === professionalId ? "sent" : "received"}`}>
                                <div className="message-bubble">
                                    <p>{msg.message || "Message error!"}</p>
                                </div>
                                <div className="message-info">
                                    <span className="timestamp">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-messages">Start the conversation!</p>
                    )}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send message on Enter
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalChat;
