import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBarUser.css';

const NavBarUser = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('user')); // Fix: Correct key

    if (storedUserData && storedUserData._id) {
      setUserData(storedUserData);
    } else {
      navigate('/login'); // Fix: Remove unnecessary timeout
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!profileMenuRef.current || !profileButtonRef.current) return;

      if (
        !profileMenuRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (!userData || !userData._id) {
      alert('Session expired, please log in again.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userData._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  if (!userData) return null; // Prevents rendering until userData is set

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <div className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          <Link to='/userdashboard'>
         <div className="logo-container">
            <img src="/images/Screenshot 2025-01-31 223032.png" alt="Amivue Logo" className="logo" />
          </div></Link>
          <Link to='/chatlist'>
         <div className="logo-container">
            <img src="/images/Screenshot 2025-02-13 213613.png" alt="chat Logo" className="logo" />
          </div></Link>
        </div>

        <div className="navbar-right">
          <div className="profile-container">
            <div
              ref={profileButtonRef}
              className="profile-image-container"
              onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
            >
              <img 
  src={
    userData?.profilePicture?.startsWith("/uploads/") 
      ? `http://localhost:8080${userData.profilePicture}` // Load user-uploaded image from backend
      : userData?.profilePicture?.startsWith("https")
      ? userData.profilePicture // Load Google profile image
      : "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png" // Default fallback image
  } 
  alt={userData?.fullName || "Profile"} 
  className="profile-image" 
/>

              {userData?.status === 'active' && (
                <div className="active-status-dot"></div>
              )}
            </div>
            {isProfileMenuOpen && (
              <div ref={profileMenuRef} className="profile-dropdown">
                <button onClick={() => navigate('/userprofile')}>View Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
    <button className="nav-item" onClick={() => { 
      navigate('/userprofile'); 
      setSidebarOpen(false);
    }}>
      Profile
    </button>
    
    <button className="nav-item" onClick={() => { 
      navigate('/history'); 
      setSidebarOpen(false);
    }}>
      History
    </button>
    
    <button className="nav-item" onClick={() => { 
      navigate('/userdata'); 
      setSidebarOpen(false);
    }}>
      Basic Analysis
    </button>

    <button className="nav-item" onClick={() => { 
      navigate('/takeatest'); 
      setSidebarOpen(false);
    }}>
      Take a Test
    </button>


    <button className="nav-item" onClick={() => { 
      navigate('/professionalslist'); 
      setSidebarOpen(false);
    }}>
      Professionals
    </button>

    <button className="nav-item" onClick={() => { 
      navigate('/simulation'); 
      setSidebarOpen(false);
    }}>
      Simulation
    </button>
  </nav>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </>
  );
};

export default NavBarUser;
