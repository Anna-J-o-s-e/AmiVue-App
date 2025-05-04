import React, { useState, useEffect } from "react";
import NavBarProfessional from "./NavBarProfessional";
import VisualAcuityReports from "./VisualAcuityReports";
import UserDataReports from "./UserDataReports";
import "./UserDashboard.css"; // Reusing the same CSS

const ProfessionalDashboard = () => {
    const [activeTab, setActiveTab] = useState("visualAcuity");

    useEffect(() => {
        console.log("Professional Dashboard Loaded!");
    }, []);

    return (
        <div className="dashboard-container">
            <NavBarProfessional />

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

export default ProfessionalDashboard;
