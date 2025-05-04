import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone"; // ✅ Import Moment.js for better date handling
import NavBarAdmin from "./NavBarAdmin";
import "./AdminDashboard.css"; // Scoped styles only for this page

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("visualAcuity");
    const [engagementData, setEngagementData] = useState({});
    const [visualAcuityData, setVisualAcuityData] = useState([]);
    const [userDataResults, setUserDataResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("AdminDashboard Loaded!");
        const fetchData = async () => {
            try {
                const [engagementRes, reportsRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/admin/user-engagement"),
                    axios.get("http://localhost:5000/api/admin/all-user-reports"),
                ]);

                setEngagementData(engagementRes.data);
                setVisualAcuityData(reportsRes.data.visual_acuity_reports);
                setUserDataResults(reportsRes.data.user_data_results);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ✅ Corrected Timestamp Formatting using Moment.js
    const formatDate = (timestamp) => {
        if (!timestamp) return "Invalid Date";
        return moment.utc(timestamp).tz(moment.tz.guess()).format("MM/DD/YYYY hh:mm:ss A");
    };

    return (
        <div className="admin-dashboard">
            <NavBarAdmin />

            {/* Admin Stats Section */}
            <div className="admin-dashboard__stats">
                <h2>📊 User Engagement Stats</h2>
                <div className="admin-dashboard__stats-container">
                    {["daily_active_users", "weekly_active_users", "monthly_active_users"].map((key, idx) => (
                        <div key={idx} className="admin-dashboard__stat-card">
                            <h5>{key.replace(/_/g, " ").toUpperCase()}</h5>
                            <p>{engagementData[key] || 0}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="admin-dashboard__tabs">
                <button
                    className={`admin-dashboard__tab ${activeTab === "visualAcuity" ? "active" : ""}`}
                    onClick={() => setActiveTab("visualAcuity")}
                >
                    📊 Visual Acuity Reports
                </button>
                <button
                    className={`admin-dashboard__tab ${activeTab === "userData" ? "active" : ""}`}
                    onClick={() => setActiveTab("userData")}
                >
                    📝 Comprehensive Eye Health Reports
                </button>
            </div>

            {/* Tab Content */}
            <div className="admin-dashboard__content">
                {loading ? (
                    <p className="admin-dashboard__loading">Loading data...</p>
                ) : error ? (
                    <p className="admin-dashboard__error">{error}</p>
                ) : activeTab === "visualAcuity" ? (
                    <div className="admin-dashboard__table-container">
                        <h2>📊 Visual Acuity Reports</h2>
                        <table className="admin-dashboard__table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Accuracy</th>
                                    <th>Avg Response Time</th>
                                    <th>Total Attempts</th>
                                    <th>Insights</th>
                                    <th>Vision Issues</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visualAcuityData.map((report) => (
                                    <tr key={report._id}>
                                        <td>{report.user_id}</td>
                                        <td>{report.accuracy}%</td>
                                        <td>{report.avg_response_time}s</td>
                                        <td>{report.total_attempts}</td>
                                        <td>
                                            <ul>
                                                {report.insights.map((insight, idx) => (
                                                    <li key={idx}>{insight}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td>{report.vision_issues}</td>
                                        <td>{formatDate(report.timestamp)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="admin-dashboard__table-container">
                        <h2>📝 Comprehensive Eye Health Reports</h2>
                        <table className="admin-dashboard__table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Detected Issues</th>
                                    <th>Risk Level</th>
                                    <th>High Risk Probability</th>
                                    <th>Low Risk Probability</th>
                                    <th>Insights</th>
                                    <th>Recommendations</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userDataResults.map((userData) => (
                                    <tr key={userData._id}>
                                        <td>{userData.user_id}</td>
                                        <td>
                                            {Object.entries(userData.detected_issues).map(([issue, values], idx) => (
                                                <div key={idx}>
                                                    <strong>{issue}:</strong>
                                                    <ul>
                                                        {values.map((value, i) => (
                                                            <li key={i}>{value}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </td>
                                        <td>{userData.risk_level}</td>
                                        <td>{userData.high_risk_probability}</td>
                                        <td>{userData.low_risk_probability}</td>
                                        <td>{userData.insights}</td>
                                        <td>{userData.recommendations}</td>
                                        <td>{formatDate(userData.timestamp)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
