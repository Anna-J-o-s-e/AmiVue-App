import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import NavBarUser from "./NavBarUser";
const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "user") {
      setUser(storedUser);
    }
  }, []);

  if (!user) {
    return <div className="text-center text-gray-500 mt-5">No user data found.</div>;
  }

  // Fix: Ensure the correct image URL
  const profilePictureUrl = user.profilePicture.startsWith("/uploads/")
    ? `http://localhost:8080${user.profilePicture}`
    : user.profilePicture;

  return (
    <div>
        <NavBarUser/>
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">User Profile</h2>
      <div className="flex flex-col items-center">
        <img 
          src={profilePictureUrl} 
          alt="Profile" 
          className="w-24 h-24 rounded-full mb-4 border-2 border-gray-300" 
        />
      </div>
      <div className="space-y-2">
  <div className="profile-detail"><strong>Name:</strong> <span>{user.fullName}</span></div>
  <div className="profile-detail"><strong>Username:</strong> <span>{user.username}</span></div>
  <div className="profile-detail"><strong>Email:</strong> <span>{user.email}</span></div>
  <div className="profile-detail"><strong>Mobile Number:</strong> <span>{user.mobileNumber}</span></div>
  <div className="profile-detail"><strong>Date of Birth:</strong> <span>{new Date(user.dob).toDateString()}</span></div>
  <div className="profile-detail"><strong>Gender:</strong> <span>{user.gender}</span></div>
  <div className="profile-detail"><strong>Status:</strong> <span>{user.status}</span></div>
  <div className="profile-detail"><strong>Role:</strong> <span>{user.role}</span></div>
  <div className="profile-detail"><strong>Account Created At:</strong> <span>{new Date(user.createdAt).toLocaleString()}</span></div>
</div>

    </div>
    </div>
  );
};

export default UserProfile;
