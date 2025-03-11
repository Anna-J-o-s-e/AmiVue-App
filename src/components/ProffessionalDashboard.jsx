import React, { useEffect } from 'react';
import NavBarProfessional from './NavBarProfessional';

const ProffessionalDashboard = () => {
  useEffect(() => {
    console.log("ProfessionalDashboard Loaded!");
  }, []);

  return (
    <div>
     <NavBarProfessional/> 
    <h1>Welcome to Professional Dashboard</h1>
    </div>
  );
};

export default ProffessionalDashboard;
