import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Chat.css";
import NavBarUser from "./NavBarUser";

const Chat = () => {
    const { professionalId } = useParams();
    const [userId, setUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [professionalName, setProfessionalName] = useState("Professional");

    // Retrieve user ID from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserId(parsedUser._id);
                console.log("User ID retrieved:", parsedUser._id);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        } else {
            console.error("User data not found in localStorage!");
        }
    }, []);

    // Fetch professional name
    useEffect(() => {
        if (!professionalId) return;

        axios.get(`http://localhost:8080/professionals/${professionalId}`)
            .then(response => {
                if (response.data && response.data.fullName) {
                    setProfessionalName(response.data.fullName);
                } else {
                    console.warn("No professional name found!");
                }
            })
            .catch(error => console.error("Error fetching professional details:", error));
    }, [professionalId]);

    // Fetch messages (including replies)
    const fetchMessages = async () => {
        if (!userId || !professionalId) return;

        try {
            const response = await axios.get(`http://localhost:8080/messages/${userId}/${professionalId}`);
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
    }, [userId, professionalId]);

    // Send new message
    const sendMessage = async () => {
        if (!newMessage.trim() || !userId) return;

        try {
            const response = await axios.post("http://localhost:8080/send-message", {
                senderId: userId,
                receiverId: professionalId,
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
            <div className="chat-container">
                <NavBarUser />
                <h2>Chat with {professionalName}</h2>
                <div className="chat-box">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div key={msg._id || index} className={`message-container ${msg.senderId === userId ? "sent" : "received"}`}>
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

export default Chat;
