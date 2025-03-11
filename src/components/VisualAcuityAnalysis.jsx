import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import NavBarUser from "./NavBarUser";
import "./VisualAcuityAnalysis.css";

const VisualAcuityAnalysis = () => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({ fullName: "", age: "" });
    const navigate = useNavigate();
    const reportRef = useRef(null);

    useEffect(() => {
        fetchUserDetails();
        fetchLatestAnalysis();
    }, []);

    // Fetch user details from local storage
    const fetchUserDetails = () => {
        const userDataString = localStorage.getItem("user");
        if (!userDataString) return;

        const userData = JSON.parse(userDataString);
        const fullName = userData?.fullName || "User";
        const dob = userData?.dob; // Assuming dob is in ISO format

        let age = "Unknown";
        if (dob) {
            const birthDate = new Date(dob);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();

            // Adjust if birthday hasn't occurred yet this year
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }

        setUserDetails({ fullName, age });
    };

    const fetchLatestAnalysis = async () => {
        try {
            const userDataString = localStorage.getItem("user");
            if (!userDataString) {
                alert("User not logged in.");
                return;
            }

            const userData = JSON.parse(userDataString);
            const userId = userData?._id;

            if (!userId) {
                alert("User ID not found.");
                return;
            }

            const response = await axios.get(`http://localhost:5000/api/visual-acuity/analysis/${userId}`);

            if (response.data.error) {
                console.error("Error fetching analysis:", response.data.error);
                setAnalysis(null);
            } else {
                setAnalysis(response.data);
            }
        } catch (error) {
            console.error("Error fetching analysis:", error);
            setAnalysis(null);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        const input = reportRef.current;

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.text(`Visual Acuity Report`, 10, 10);
            pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight);
            pdf.save(`Visual_Acuity_Report_${userDetails.fullName}.pdf`);
        });
    };

    return (
        <div>
            <NavBarUser />
            <div className="visual-acuity-analysis">
            <div className="analysis-container">
                <h1 className="analysis-title">Visual Acuity Analysis</h1>

                {loading ? (
                    <p>Loading analysis...</p>
                ) : analysis ? (
                    <div>
                        <div className="analysis-content" ref={reportRef}>
                            {/* Display User Name & Age in UI */}
                            <p><strong>Name:</strong> {userDetails.fullName}</p>
                            <p><strong>Age:</strong> {userDetails.age}</p>

                            <p><strong>Total Attempts:</strong> {analysis.total_attempts}</p>
                            <p><strong>Correct Answers:</strong> {analysis.correct_answers}</p>
                            <p><strong>Accuracy:</strong> {analysis.accuracy}%</p>
                            <p><strong>Average Response Time:</strong> {analysis.avg_response_time} sec</p>
                            <p><strong>Fastest Response:</strong> {analysis.fastest_response} sec</p>
                            <p><strong>Slowest Response:</strong> {analysis.slowest_response} sec</p>

                            {analysis.size_performance && Object.keys(analysis.size_performance).length > 0 ? (
                                <>
                                    <h2>Performance by Digit Size:</h2>
                                    <table className="analysis-table">
                                        <thead>
                                            <tr>
                                                <th>Digit Size</th>
                                                <th>Accuracy (%)</th>
                                                <th>Correct</th>
                                                <th>Total Attempts</th>
                                                <th>Avg Response Time (sec)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(analysis.size_performance).map(([size, data], index) => (
                                                <tr key={index}>
                                                    <td>{size}px</td>
                                                    <td>{data.accuracy}%</td>
                                                    <td>{data.correct}</td>
                                                    <td>{data.total}</td>
                                                    <td>{data.avg_response_time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <p>No size-based performance data available.</p>
                            )}

                            <h2>Vision Insights:</h2>
                            <p><strong>Inferences:</strong> {analysis.vision_issues}</p>
                            <ul>
                                {analysis.insights.map((insight, index) => (
                                    <li key={index}>{insight}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Button to Download Report */}
                        <button className="download-btn" onClick={downloadPDF}>
                            Download Report (PDF)
                        </button>
                    </div>
                ) : (
                    <p>No recent test analysis available.</p>
                )}
            </div>
            </div>
        </div>
    );
};

export default VisualAcuityAnalysis;
