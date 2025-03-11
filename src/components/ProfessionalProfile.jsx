import React, { useEffect, useState } from "react";
import "./ProfessionalProfile.css";
import NavBarProfessional from "./NavBarProfessional";

const ProfessionalProfile = () => {
  const [professional, setProfessional] = useState(null);

  useEffect(() => {
    // Retrieve professional data from local storage
    const storedProfessional = JSON.parse(localStorage.getItem("user"));
    if (storedProfessional && storedProfessional.role === "professional") {
      setProfessional(storedProfessional);
    }
  }, []);

  if (!professional) {
    return <div className="text-center text-gray-500 mt-5">No professional data found.</div>;
  }

  // Fix: Ensure the correct image URL
  const profilePictureUrl = professional.profilePicture.startsWith("http")
    ? professional.profilePicture
    : `http://localhost:8080/${professional.profilePicture}`;

  return (
    <div className="professional-profile-page">
    <NavBarProfessional />
    <div className="profile-card">
      <h2 className="profile-header">Profile</h2>
      <div className="flex flex-col items-center">
        <img 
          src={profilePictureUrl} 
          alt="Profile" 
          className="profile-picture" 
        />
      </div>
      <div className="profile-details">
        <div className="profile-detail"><strong>Name:</strong> <span>{professional.fullName}</span></div>
        <div className="profile-detail"><strong>Username:</strong> <span>{professional.username}</span></div>
        <div className="profile-detail"><strong>Email:</strong> <span>{professional.email}</span></div>
        <div className="profile-detail"><strong>Mobile Number:</strong> <span>{professional.mobileNumber}</span></div>
        <div className="profile-detail"><strong>Date of Birth:</strong> <span>{new Date(professional.dob).toDateString()}</span></div>
        <div className="profile-detail"><strong>Gender:</strong> <span>{professional.gender}</span></div>
        <div className="profile-detail"><strong>Profession:</strong> <span>{professional.profession}</span></div>
        <div className="profile-detail"><strong>Working Place:</strong> <span>{professional.workingPlace}</span></div>
        <div className="profile-detail"><strong>Years of Experience:</strong> <span>{professional.yearsOfExperience}</span></div>
        <div className="profile-detail"><strong>Preferred Contact Time:</strong> <span>{professional.preferredContactTime}</span></div>
        <div className="profile-detail"><strong>Status:</strong> <span>{professional.status}</span></div>
        <div className="profile-detail"><strong>Role:</strong> <span>{professional.role}</span></div>
        <div className="profile-detail"><strong>Account Created At:</strong> <span>{new Date(professional.createdAt).toLocaleString()}</span></div>
      </div>
    </div>
  </div>
  );
};

export default ProfessionalProfile;
