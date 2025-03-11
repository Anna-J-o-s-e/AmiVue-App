import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBarUser.css';

const NavBarProfessional = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    if (storedUserData && storedUserData._id) {
      setUserData(storedUserData);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!profileMenuRef.current || !profileButtonRef.current) return;
      if (!profileMenuRef.current.contains(event.target) && !profileButtonRef.current.contains(event.target)) {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData._id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Logout failed');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  if (!userData) return null;

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
          <Link to='/professionaldashboard'>
            <div className="logo-container">
              <img src="/images/Screenshot 2025-01-31 223032.png" alt="AmiVue Logo" className="logo" />
            </div>
          </Link>
          <Link to='/professionalchatlist'>
            <div className="logo-container">
              <img src="/images/Screenshot 2025-02-13 213613.png" alt="Chat Logo" className="logo" />
            </div>
          </Link>
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
    userData?.profilePicture?.startsWith("uploads/")
      ? `http://localhost:8080/${userData.profilePicture}?t=${new Date().getTime()}`
      : userData?.profilePicture?.startsWith("https")
      ? `${userData.profilePicture}?t=${new Date().getTime()}`
      : "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png"
  }
  alt={userData?.fullName || "Profile"}
  className="profile-image"
/>

              {userData?.status === 'active' && <div className="active-status-dot"></div>}
            </div>
            {isProfileMenuOpen && (
              <div ref={profileMenuRef} className="profile-dropdown">
                <button onClick={() => navigate('/professionalprofile')}>View Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => { navigate('/professionalprofile'); setSidebarOpen(false); }}>Profile</button>
          <button className="nav-item" onClick={() => { navigate('/appointments'); setSidebarOpen(false); }}>Appointments</button>
          <button className="nav-item" onClick={() => { navigate('/patient-history'); setSidebarOpen(false); }}>Patient History</button>
          <button className="nav-item" onClick={() => { navigate('/consultations'); setSidebarOpen(false); }}>Consultations</button>
          <button className="nav-item" onClick={() => { navigate('/professionalchatlist'); setSidebarOpen(false); }}>Chat</button>
          <button className="nav-item" onClick={() => { navigate('/simulation'); setSidebarOpen(false); }}>Simulation</button>
        </nav>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </>
  );
};

export default NavBarProfessional;
