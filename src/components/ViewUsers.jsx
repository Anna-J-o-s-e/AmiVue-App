import React, { useEffect, useState } from "react";
import "./ViewUsers.css"; // Import the CSS file
import NavBarAdmin from "./NavBarAdmin";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/viewusers");
      const data = await response.json();
      if (data.status === "success") {
        setUsers(data.data);
      } else {
        console.error("Error fetching users:", data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/deleteuser/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("User deleted successfully!");
        fetchUsers(); // Refresh user list after deletion
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <div>
      <NavBarAdmin />
      <div className="view-users-container">
        <h2 className="view-users-title">Users List</h2>
        {loading ? (
          <p className="view-users-loading">Loading...</p>
        ) : users.length === 0 ? (
          <p className="view-users-empty">No users found.</p>
        ) : (
          <table className="view-users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Role</th>
                <th>Profile Picture</th>
                <th>Action</th> {/* Added Action column for delete button */}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.mobileNumber}</td>
                  <td>{user.gender}</td>
                  <td className={`status-${user.status}`}>{user.status}</td>
                  <td>{user.role}</td>
                  <td>
                    <img
                      src={
                        user.profilePicture?.startsWith("/uploads/")
                          ? `http://localhost:8080${user.profilePicture}`
                          : user.profilePicture?.startsWith("https")
                          ? user.profilePicture
                          : "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png"
                      }
                      alt="Profile"
                      className="view-users-profile-pic"
                    />
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteUser(user._id)}>
                      Delete
                    </button>
                  </td> {/* Delete button */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;
