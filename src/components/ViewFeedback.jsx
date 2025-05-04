import React, { useEffect, useState } from "react";
import "./Viewfeedback.css"; // Scoped CSS
import NavBarAdmin from "./NavBarAdmin";

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/get-feedbacks")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setFeedbacks(data.data);
        } else {
          console.error("Error fetching feedback:", data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
        <NavBarAdmin/>
   
    <div className="view-feedback-container">
      <h2>Feedback Received</h2>

      {loading ? (
        <p className="loading-message">Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p className="no-feedback-message">No feedbacks available.</p>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback, index) => (
              <tr key={feedback._id}>
                <td>{index + 1}</td>
                <td>{feedback.fullName}</td>
                <td>{feedback.email}</td>
                <td>{feedback.rating} ⭐</td>
                <td>{feedback.message || "No message provided"}</td>
                <td>{new Date(feedback.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default ViewFeedback;
