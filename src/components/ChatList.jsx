import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChatList.css";
import NavBarUser from "./NavBarUser";

const ChatList = () => {
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser._id) {
          navigate("/login"); // Redirect if user not logged in
          return;
        }

        const response = await axios.get(`http://localhost:8080/chat-list/${storedUser._id}`);
        setChatList(response.data);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };

    fetchChatList();
  }, [navigate]);

  const openChat = async (professionalId) => {
    try {
      // Mark messages as read
      await axios.post("http://localhost:8080/mark-messages-read", {
        userId: JSON.parse(localStorage.getItem("user"))._id,
        professionalId,
      });

      // Update chat list to remove the "new message" badge for this chat
      setChatList((prevChats) =>
        prevChats.map((chat) =>
          chat.professionalId === professionalId ? { ...chat, hasNewMessage: false } : chat
        )
      );

      // Navigate to the chat page
      navigate(`/chat/${professionalId}`);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  return (
    <div className="chat-list-page">
      <NavBarUser />
      <div className="chat-list-container">
        <h2>Your Chats</h2>

        {chatList.length === 0 ? (
          <p>No chats available.</p>
        ) : (
          <ul className="chat-list">
            {chatList.map((chat) => (
              <li
                key={chat.professionalId}
                className={`chat-item ${chat.hasNewMessage ? "unread" : ""}`}
                onClick={() => openChat(chat.professionalId)}
              >
                <img
                  src={
                    chat.professionalProfilePic?.startsWith("/uploads")
                      ? `http://localhost:8080${chat.professionalProfilePic}`
                      : chat.professionalProfilePic?.startsWith("https")
                      ? chat.professionalProfilePic
                      : "/default-avatar.png"
                  }
                  alt={chat.fullName}
                  className="profile-pic"
                />

                <div className="chat-info">
                  <span className="full-name">{chat.fullName || "Unknown Professional"}</span>
                  <span className="username">{chat.username ? `@${chat.username}` : ""}</span>
                </div>

                {chat.hasNewMessage && <span className="new-message-badge">New Message</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatList;
