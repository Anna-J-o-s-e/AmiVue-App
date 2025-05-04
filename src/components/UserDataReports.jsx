import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarUser from "./NavBarUser";
import "./UserDataReports.css";

const UserDataReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve user ID from localStorage
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : {};
  const userId = userData?._id;

  useEffect(() => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/user-data/reports/${userId}`
        );

        const data = await response.json();
        if (response.ok) {
          setReports(data.reports);
        } else {
          setError(data.error || "Failed to load reports.");
        }
      } catch (err) {
        setError("Error fetching reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userId]);

  return (
    <div>
      <div className="userdata-reports-container">
        {loading ? (
          <p className="userdata-loading">⏳ Loading reports...</p>
        ) : error ? (
          <p className="userdata-error">{error}</p>
        ) : reports.length === 0 ? (
          <p className="userdata-no-reports">No reports found.</p>
        ) : (
          <table className="userdata-reports-table">
            <thead>
              <tr>
                <th>📅 Date</th>
               
                
                <th>⚠️ High-Risk Behaviors</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>{new Date(report.timestamp).toLocaleString()}</td>
                  
                  
                  <td className="userdata-high-risk">
                    {report.detected_issues?.["High-Risk Behaviors"]?.length >
                    0 ? (
                      <ul>
                        {report.detected_issues["High-Risk Behaviors"].map(
                          (behavior, index) => (
                            <li key={index}>⚠️ {behavior}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      "No high-risk behaviors detected"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserDataReports;
