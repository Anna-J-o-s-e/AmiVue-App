import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css"; 

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("Submitting login form with:", formData);
      const response = await axios.post('http://localhost:8080/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log("Response received:", response);
      const data = response.data;
      console.log("User data received:", data.user);

      // Store token and user data with the correct key
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Fix: ensure correct key

      console.log("Stored user data in localStorage");

      // Navigate based on user role
      if (data.user.role === 'admin') {
        console.log("Redirecting to Admin Dashboard");
        navigate('/admindashboard');
      } else if (data.user.role === 'professional') {
        console.log("Redirecting to Professional Dashboard");
        navigate('/professionaldashboard');
      } else {
        console.log("Redirecting to User Dashboard");
        navigate('/userdashboard');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <a href="/forgotpassword">Forgot Password?</a>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserLogin;
