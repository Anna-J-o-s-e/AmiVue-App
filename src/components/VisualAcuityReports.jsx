import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone"; // ✅ Import moment-timezone
import "./VisualAcuityreports.css"; // Import the CSS file

const VisualAcuityReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initial fetch
        fetchReports();

        // Set an interval to refresh the reports every 2 minutes (120000 ms)
        const intervalId = setInterval(() => {
            fetchReports();
        }, 120000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const fetchReports = async () => {
        try {
            const userDataString = localStorage.getItem("user");
            if (!userDataString) {
                setError("User not logged in.");
                return;
            }

            const userData = JSON.parse(userDataString);
            const userId = userData?._id;

            if (!userId) {
                setError("User ID not found.");
                return;
            }

            setLoading(true); // Set loading true before making API request
            const response = await axios.get(
                `http://127.0.0.1:5000/api/visual-acuity/reports/${userId}`
            );

            if (response.data.error) {
                setError(response.data.error);
                setReports([]); // Clear reports if error
            } else {
                setReports(response.data.reports);
            }
        } catch (error) {
            setError("Failed to fetch reports. Try again later.");
            setReports([]); // Clear reports on error
        } finally {
            setLoading(false); // Set loading false after fetching data
        }
    };

    // ✅ Convert UTC timestamp to user's local time zone
    const formatDate = (timestamp) => {
        return moment.utc(timestamp) // Parse as UTC
            .tz(moment.tz.guess()) // Convert to user's local timezone
            .format("MM/DD/YYYY, hh:mm:ss A"); // Format properly
    };

    return (
        <div className="reports-container">
            {loading ? (
                <p className="loading">Loading reports...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : reports.length === 0 ? (
                <p className="no-reports">No reports found.</p>
            ) : (
                <table className="reports-table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Total Attempts</th>
                            <th>Correct Answers</th>
                            <th>Accuracy (%)</th>
                            <th>Avg Response Time (sec)</th>
                            <th>Vision Insights</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, index) => (
                            <tr key={index}>
                                <td>{formatDate(report.timestamp)}</td> {/* ✅ Fixed timestamp conversion */}
                                <td>{report.total_attempts}</td>
                                <td>{report.correct_answers}</td>
                                <td>{report.accuracy}%</td>
                                <td>{report.avg_response_time}</td>
                                <td>
                                    <ul>
                                        {report.insights.map((insight, idx) => (
                                            <li key={idx}>{insight}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default VisualAcuityReports;
