import React, { useState } from 'react';
import axios from 'axios';
import "./ForgotPassword.css";


const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isPasswordEditable, setIsPasswordEditable] = useState(false); // Track if the password field is editable
  const [userId, setUserId] = useState(null);

  // Handle the form submission for username and email verification
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Check if username and email are provided
    if (!username || !email) {
      setMessage('Both username and email are required!');
      return;
    }

    try {
      // Send the forgot password request to the backend
      const response = await axios.post('http://localhost:8080/forgot-password', { username, email });
      if (response.data.message === 'User verified successfully! Please enter your new password.') {
        setMessage(response.data.message); // Display success message
        setUserId(response.data.userId); // Store the userId for password reset
        setIsPasswordEditable(true); // Enable the password field
      } else {
        setMessage(response.data.message); // Display error message
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  // Handle resetting the password
  const handleResetPassword = async () => {
    if (!newPassword) {
      setMessage('New password is required!');
      return;
    }

    try {
      // Send the new password to the backend for password reset
      const response = await axios.post(`http://localhost:8080/reset-password/${userId}`, { newPassword });
      setMessage(response.data.message); // Show success or error message
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password ?</h2>
      
      {/* Form for entering username and email */}
      <form onSubmit={handleForgotPassword}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-container">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Submit button for username/email validation */}
        <button type="submit">Submit</button>
      
        <div class="link-container">
  <p>Back to Login ?
    <a href="/login" class="login-link">Click Here</a>
  </p>
</div>

      {/* Display the message (success/error) */}
      <div className="message">{message}</div>

      {/* New password input field, initially disabled */}
      {isPasswordEditable && (
        <div className="input-container">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
      )}

      {/* Button to reset password */}
      {isPasswordEditable && (
        <button onClick={handleResetPassword}>Reset Password</button>
      )}
      </form>
    </div>
  );
};

export default ForgotPassword;
