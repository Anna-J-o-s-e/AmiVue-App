import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarUser from "./NavBarUser";
import "./ProfessionalsList.css";

const ProfessionalsList = () => {
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/professionals")
            .then((response) => {
                console.log("API Response:", response.data);

                if (response.data && Array.isArray(response.data.data)) {
                    setProfessionals(response.data.data);
                } else {
                    console.error("Unexpected API response format:", response.data);
                    setProfessionals([]);
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Navigate to chat with the selected professional
    const startChat = (professional) => {
        navigate(`/chat/${professional._id}`, { state: { professional } });
    };

    if (loading) return <p>Loading professionals...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="professionals-container">
            <NavBarUser />
            <h2>Our Professionals</h2>
            {professionals.length === 0 ? (
                <p>No professionals found.</p>
            ) : (
                <ul>
                    {professionals.map((professional) => (
                        <li key={professional._id} className="professional-card">
                            <div className="professional-details">
                                {professional.profilePicture && (
                                    <img
                                        src={professional.profilePicture}
                                        alt={`${professional.fullName}'s profile`}
                                    />
                                )}
                                <h3>{professional.fullName}</h3>
                                <p><strong>Username:</strong> {professional.username}</p>
                                <p><strong>Profession:</strong> {professional.profession}</p>
                                <p><strong>Work place:</strong> {professional.workingPlace}</p>
                                {/* <p><strong>Experience:</strong> {professional.yearsOfExperience} years</p> */}
                                <p><strong>Contact Time:</strong> {professional.preferredContactTime}</p>
                                
                            </div>
                            <button className="chat-button" onClick={() => startChat(professional)}>Chat</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProfessionalsList;
