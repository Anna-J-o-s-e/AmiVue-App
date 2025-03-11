import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./LandingPage.css"; // Import the CSS file

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="landing-page">
      {/* Background Image */}
      <img
        className="background-image"
        src="https://t4.ftcdn.net/jpg/05/32/94/41/360_F_532944133_IdvCtLHlBSxkGrzOhRg0i4ywwCBy8ecA.jpg"
        alt="Background"
      />

      {/* Header Title */}
      <div className="header-title">
        <div className="amivue-text">AMIVUE</div>
      </div>

      {/* Subtitle */}
      <div className="subtitle">
        <div className="subtitle-text">A friend of vision</div>
      </div>

      {/* Main Container */}
      <div className="main-container">
        {/* Login Button */}
        <button className="button login-button" onClick={() => navigate("/Login")}>
          <span className="button-text">Login</span>
        </button>

        {/* Haven't Been Here Text */}
        <div className="haven-text">Haven’t been here?</div>

        {/* Get Started Button */}
        <button className="button get-started-button" onClick={() => navigate("/usersignup")} >
        
          <span className="button-text">Get Started</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;


