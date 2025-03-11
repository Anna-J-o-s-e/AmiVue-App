import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChatList.css";
import NavBarProfessional from "./NavBarProfessional";

const ProfessionalChatList = () => {
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const storedProfessional = JSON.parse(localStorage.getItem("user"));
        if (!storedProfessional || !storedProfessional._id) {
          navigate("/login"); // Redirect if professional not logged in
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/professional-chat-list/${storedProfessional._id}`
        );

        setChatList(response.data);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };

    fetchChatList();
  }, [navigate]);

  const openChat = async (userId) => {
    try {
      // Mark messages as read
      await axios.post("http://localhost:8080/mark-messages-read-professional", {
        professionalId: JSON.parse(localStorage.getItem("user"))._id,
        userId,
      });

      // Update chat list to remove "new message" badge
      setChatList((prevChats) =>
        prevChats.map((chat) =>
          chat._id === userId ? { ...chat, unreadMessages: 0 } : chat
        )
      );

      // Navigate to chat page
      navigate(`/professional-chat/${userId}`);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  return (
    <div className="chat-list-page">
      <NavBarProfessional />
      <div className="chat-list-container">
        <h2>Your Chats</h2>
        {chatList.length === 0 ? (
          <p>No chats available.</p>
        ) : (
          <ul className="chat-list">
            {chatList.map((chat) => {
              const lastMessage = chat.lastMessage || "No messages yet"; // Ensure lastMessage is defined
              
              return (
                <li
                  key={chat._id}
                  className={`chat-item ${chat.unreadMessages > 0 ? "unread" : ""}`}
                  onClick={() => openChat(chat._id)}
                >
                  <img
                    src={
                      chat.profilePicture?.startsWith("/uploads") 
                        ? `http://localhost:8080${chat.profilePicture}`  // Load from backend uploads
                        : chat.profilePicture?.startsWith("https") 
                          ? chat.profilePicture  // Load Google profile image
                          : "/default-avatar.png"  // Fallback image
                    }
                    alt={chat.fullName}
                    className="profile-pic"
                  />

                  <div className="chat-info">
                    <span className="full-name">{chat.fullName || "Unknown User"}</span>
                    <span className="username">{chat.username ? `@${chat.username}` : ""}</span>
                    <span className="last-message">{lastMessage}</span>
                  </div>

                  {chat.unreadMessages > 0 && <span className="new-message-badge">New Message</span>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfessionalChatList;
