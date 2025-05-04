import React, { useState } from "react";
import NavBarUser from "./NavBarUser";
import VisualAcuityReports from "./VisualAcuityReports";
import UserDataReports from "./UserDataReports";
import "./UserDashboard.css"; // Import styling

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState("visualAcuity");

    return (
        <div className="dashboard-container">
            <NavBarUser />

           

            {/* Horizontal Tab Navigation */}
            <div className="dashboard-tabs">
                <button
                    className={`dashboard-tab ${activeTab === "visualAcuity" ? "active" : ""}`}
                    onClick={() => setActiveTab("visualAcuity")}
                >
                    📊 Visual Acuity Reports
                </button>
                <button
                    className={`dashboard-tab ${activeTab === "userData" ? "active" : ""}`}
                    onClick={() => setActiveTab("userData")}
                >
                    📝 Comprehensive Eye Health Reports
                </button>
            </div>

            {/* Render Selected Tab Content */}
            <div className="dashboard-tab-content">
                {activeTab === "visualAcuity" && <VisualAcuityReports />}
                {activeTab === "userData" && <UserDataReports />}
            </div>
        </div>
    );
};

export default UserDashboard;
