import React, { useEffect, useState } from "react";
import "./ViewProfessionals.css"; // Import the CSS file
import NavBarAdmin from "./NavBarAdmin";

const ViewProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/viewprofessionals") // Fetch professionals list
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setProfessionals(data.data);
        } else {
          console.error("Error fetching professionals:", data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setLoading(false);
      });
  }, []);

  // Function to delete a professional
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this professional?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/deleteprofessional/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.status === "success") {
        setProfessionals(professionals.filter((professional) => professional._id !== id));
      } else {
        console.error("Error deleting professional:", data.message);
      }
    } catch (error) {
      console.error("Delete request failed:", error);
    }
  };

  return (
    <div>
      <NavBarAdmin />
      <div className="view-professionals-container">
        <h2 className="view-professionals-title">Professionals List</h2>
        {loading ? (
          <p className="view-professionals-loading">Loading...</p>
        ) : professionals.length === 0 ? (
          <p className="view-professionals-empty">No professionals found.</p>
        ) : (
          <table className="view-professionals-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile Number</th>
                
                <th>Profession</th>
                <th>Working Place</th>
                <th>Experience</th>
                <th>Preferred Contact Time</th>
                
               
                <th>Profile Picture</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {professionals.map((professional, index) => (
                <tr key={professional._id}>
                  <td>{index + 1}</td>
                  <td>{professional.fullName}</td>
                  <td>{professional.username}</td>
                  <td>{professional.email}</td>
                  <td>{professional.mobileNumber}</td>
                 
                  <td>{professional.profession}</td>
                  <td>{professional.workingPlace}</td>
                  <td>{professional.yearsOfExperience} years</td>
                  <td>{professional.preferredContactTime}</td>
                  
                 
                  <td>
                    <img
                      src={
                        professional?.profilePicture?.startsWith("/uploads/")
                          ? `http://localhost:8080${professional.profilePicture}`
                          : professional?.profilePicture?.startsWith("https")
                          ? professional.profilePicture
                          : "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png"
                      }
                      alt={professional.fullName || "Profile"}
                      className="view-professionals-profile-pic"
                    />
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(professional._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewProfessionals;
