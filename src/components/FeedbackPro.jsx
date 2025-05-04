import React, { useState, useEffect } from "react";
import "./Feedback.css"; // Scoped CSS
import NavBarProfessional from "./NavBarProfessional";

const FeedbackPro = () => {
  // Fetch user data from local storage
  const [userData, setUserData] = useState({
    userId: "",
    fullName: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUserData({
      userId: storedUser._id || "", // Ensure 'userid' exists in storage
      fullName: storedUser.fullName || "", // Correct field name
      email: storedUser.email || "",
    });

    console.log("User Data from local storage:", storedUser); // Debugging
  }, []);

  const [feedback, setFeedback] = useState({
    rating: 0, // No default selection
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // Handle rating selection
  const handleRatingClick = (rating) => {
    setFeedback({ ...feedback, rating });
  };

  // Handle text input change
  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (feedback.rating === 0) {
      setResponseMessage("Please select a rating before submitting.");
      setIsError(true);
      return;
    }

    // Combine user data with feedback
    const feedbackData = {
      userId: userData.userId,  // Ensure correct field names
      fullName: userData.fullName,  // Fix full name
      email: userData.email,
      rating: feedback.rating,
    };

    // Only add message if the user enters text
    if (feedback.message.trim() !== "") {
      feedbackData.message = feedback.message;
    }

    // Debugging: Check the data being sent
    console.log("Sending feedback:", feedbackData);

    try {
      const res = await fetch("http://localhost:8080/api/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (data.status === "success") {
        setResponseMessage("Feedback submitted successfully!");
        setIsError(false);
        setFeedback({ rating: 0, message: "" }); // Reset form
      } else {
        setResponseMessage(data.message || "Error submitting feedback. Try again!");
        setIsError(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResponseMessage("Something went wrong! Please try later.");
      setIsError(true);
    }
  };
  return (
    <div>
    <NavBarProfessional/>

    <div className="feedback-container">
      <h2>Submit Your Feedback</h2>

      {responseMessage && (
        <p className={isError ? "error-message" : "success-message"}>
          {responseMessage}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input type="text" value={userData.fullName} disabled />

        <label>Email:</label>
        <input type="email" value={userData.email} disabled />

        <label>Rating:</label>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= feedback.rating ? "star selected" : "star"}
              onClick={() => handleRatingClick(star)}
            >
              ★
            </span>
          ))}
        </div>

        <label>Message (Optional):</label>
        <textarea
          name="message"
          value={feedback.message}
          onChange={handleChange}
          placeholder="Write your feedback..."
        ></textarea>

        <button type="submit" className="feedback-button">Submit Feedback</button>
      </form>
    </div>
  </div>
  )
}

export default FeedbackPro