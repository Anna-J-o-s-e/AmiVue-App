import React, { useEffect } from 'react';
import NavBarUser from './NavBarUser';

const UserDashboard = () => {
  useEffect(() => {
    console.log("UserDashboard Loaded!");
  }, []);

  return (
    <div>
      {console.log("Rendering UserDashboard")}
      <NavBarUser />
      
    </div>
  );
};

export default UserDashboard;
