import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import NavBarUser from "./NavBarUser";
import "./UserDataAnalysis.css";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const UserDataAnalysis = () => {
  const location = useLocation();
  const reportRef = useRef(null);

  console.log("Received state:", location.state); // Debugging

  // Extract user data from state or fallback to defaults
  const {
    userName = "User",
    userAge = "Unknown",
    highRisk = 0,
    lowRisk = 0,
    riskLevel = "Unknown",
    detectedIssues = {},
    insights = "No insights available.",
    recommendations = "No recommendations available.",
  } = location.state || {};

  // Function to Download Report as PDF
  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.text("AmiVue - User Data Analysis Report", 10, 10);
      pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
      pdf.save(`User_Data_Analysis_${userName}.pdf`);
    });
  };

  return (
    <div>
      <NavBarUser />
      <div className="user-data-analysis-container" ref={reportRef}>
        <h2>Analysis Report</h2>

        {/* <div className="user-details">
          <p><strong>👤 Name:</strong> {userName}</p>
        </div> */}

        <div className="risk-section">
          <h3>🩺 Risk Assessment</h3>
          <p>
            <strong>Risk Prediction:</strong>{" "}
            <span className={`risk-${riskLevel.toLowerCase()}`}>{riskLevel}</span>
          </p>
          <p><strong>Probability of High Risk:</strong> {highRisk.toFixed(2)}</p>
          <p><strong>Probability of Low Risk:</strong> {lowRisk.toFixed(2)}</p>
        </div>

        <div className="insights-section">
          <h3>📝 Detailed Eye Health Analysis</h3>
          <p>{insights}</p>
        </div>

        {Object.keys(detectedIssues).length > 0 && (
          <div className="issues-section">
            <h3>⚠️ Detected Issues</h3>
            {Object.entries(detectedIssues).map(([category, issues]) =>
              issues.length > 0 ? (
                <div key={category} className="issue-category">
                  <h4>🔸 {category}</h4>
                  <ul>
                    {issues.map((issue, index) => (
                      <li key={index}>✅ {issue}</li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        )}

        <div className="recommendations-section">
          <h3>🔹 Recommended Actions</h3>
          <p>{recommendations}</p>
        </div>
      </div>

      <center>
        {/* PDF Download Button */}
        <button onClick={downloadPDF} className="download-btn">
          📥 Download PDF Report
        </button>
      </center>
    </div>
  );
};

export default UserDataAnalysis;
