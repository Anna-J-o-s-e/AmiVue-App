import React, { useEffect } from 'react';

const AdminDashboard = () => {
  useEffect(() => {
    console.log("AdminDashboard Loaded!");
  }, []);

  return (
    <div>
      
    <h1>Welcome to Admin Dashboard</h1>
    </div>
  );
};

export default AdminDashboard;
