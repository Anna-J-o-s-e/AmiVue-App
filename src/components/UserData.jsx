import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarUser from './NavBarUser';
import "./UserData.css";

const UserData = () => {
  const navigate = useNavigate();
  
  const [userDetails, setUserDetails] = useState({
    fullName: 'User',
    gender: 0, // Default: 0 (Unknown), 1 (Male), 2 (Female)
    dob: 'Unknown',
    userId: 'Unknown',
    age: 'Unknown',
  });

  const [responses, setResponses] = useState({
    OHQ780A: '', OHQ780B: '', OHQ780C: '', OHQ780D: '', OHQ780E: '', OHQ780F: '',
    OHQ780G: '', OHQ780H: '', OHQ780I: '', OHQ780J: '', OHQ780K: '',
    OSQ010A: '', OSQ010B: '', OSQ010C: '',
    OSQ020A: '', OSQ020B: '', OSQ020C: ''
  });

  // Fetch user details from localStorage
  useEffect(() => {
    const fetchUserDetails = () => {
      try {
        const userDataString = localStorage.getItem('user');
        if (!userDataString) return;

        const userData = JSON.parse(userDataString);
        const fullName = userData?.fullName || 'User';
        const gender = userData?.gender === 'Male' ? 1 : userData?.gender === 'Female' ? 2 : 0;
        const dob = userData?.dob;
        const userId = userData?._id;

        let age = 'Unknown';
        if (dob) {
          const birthDate = new Date(dob);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
        }

        setUserDetails({ fullName, gender, dob, userId, age });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponses({ ...responses, [name]: value });
  };

  // Transform responses into API-friendly format
  const transformResponses = () => {
    return {
      RIDAGEYR: userDetails.age,  // User's age
      RIAGENDR: userDetails.gender, // Numeric gender
      
      // Map responses to numeric values
      ...Object.fromEntries(
        Object.entries(responses).map(([key, value]) => {
          if (value === "Yes") return [key, 1];
          if (value === "No") return [key, 0];

          const numericValue = parseInt(value, 10);
          if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 4) {
            return [key, numericValue];
          }

          return [key, null]; // Default for unexpected values
        })
      )
    };
  };

  // ✅ Save Report Function
  const saveUserDataReport = async (analysisData) => {
    try {
      console.log("📤 Sending Report to /save-report:", analysisData);

      const response = await axios.post(
        "http://127.0.0.1:5000/api/user-data/save-report",
        analysisData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Save API Response:", response.data);

    } catch (error) {
      console.error("❌ Error saving report:", error);
    }
  };

  // ✅ Handle form submission with saving report
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any response is missing
    const unanswered = Object.values(responses).some(value => value.trim() === '');
    if (unanswered) {
      alert("⚠️ Please answer all questions before submitting.");
      return;
    }

    // Prepare payload
    const payload = {
      user_id: userDetails.userId,
      user_name: userDetails.fullName,
      user_age: userDetails.age,
      user_responses: transformResponses(),
      timestamp: new Date().toISOString(),
    };

    console.log('📤 Sending payload:', payload);

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/user-data/analyze',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('✅ API Response:', response.data);

      // Extract data safely
      const { prediction = {} } = response.data || {};

      // Prepare analysis data
      const analysisData = {
        user_id: userDetails.userId,
        user_name: userDetails.fullName,
        user_age: userDetails.age,
        high_risk_probability: prediction["High Risk Probability"] || 0,
        low_risk_probability: prediction["Low Risk Probability"] || 0,
        risk_level: prediction["Risk Prediction"] || "Unknown",
        detected_issues: prediction["Detected Issues"] || {},
        insights: prediction["Insights"] || "No insights available.",
        recommendations: prediction["Recommendations"] || "No recommendations available.",
        timestamp: new Date().toISOString(),
      };

      // ✅ Call API to save the report in the database
      await saveUserDataReport(analysisData);

      // ✅ Navigate to analysis page with data
      navigate('/userdataanalysis', { 
        state: { 
          userName: analysisData.user_name,
          userAge: analysisData.user_age,
          highRisk: analysisData.high_risk_probability, 
          lowRisk: analysisData.low_risk_probability, 
          riskLevel: analysisData.risk_level,
          detectedIssues: analysisData.detected_issues,
          insights: analysisData.insights,
          recommendations: analysisData.recommendations
        } 
      });

    } catch (error) {
      console.error('❌ Error submitting data:', error);

      if (error.response) {
        alert(`🚨 Backend Error: ${error.response.data.message || 'An error occurred.'}`);
      } else if (error.request) {
        alert('⚠️ No response from the server. Please try again later.');
      } else {
        alert('❌ Failed to connect to the server. Please check your connection.');
      }
    }
  };
  return (
    <div className="user-data-container">
      <NavBarUser/>
      <div className="user-details">
      <h2>Let's Go For a Quick Analysis</h2>
      <div>
        
        {/* <div>
          <strong>Full Name:</strong> {userDetails.fullName}
        </div> */}
       
        
        {/* <div>
          <strong>Age:</strong> {userDetails.age}
        </div> */}
      </div>

      <hr className="user-data-divider"/>

      
      <form onSubmit={handleSubmit} className="user-data-form">

      {/* Eye Health Questions */}
      <h3>👀 Eye Health Assessment</h3>

      {/* Screen & Light Exposure */}
      <div>
        <label>How often do you use digital screens for long hours without breaks?</label><br />
        <div className="radio-group">
          {[ "No Issues", "Mild", "Sometimes", "Often", "Always" ].map((label, index) => (
            <label key={index}>
              <input type="radio" name="OSQ010A" value={index} onChange={handleInputChange} /> {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label>How frequently are you exposed to bright lights (e.g., sunlight, LED screens, night driving)?</label><br />
        <div className="radio-group">
          {[ "No Issues", "Mild", "Sometimes", "Often", "Always" ].map((label, index) => (
            <label key={index}>
              <input type="radio" name="OSQ010B" value={index} onChange={handleInputChange} /> {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label>Do you regularly work in dusty, smoky, or chemically intense environments without eye protection?</label><br />
        <div className="radio-group">
          {[ "No Issues", "Mild", "Sometimes", "Often", "Always" ].map((label, index) => (
            <label key={index}>
              <input type="radio" name="OSQ010C" value={index} onChange={handleInputChange} /> {label}
            </label>
          ))}
        </div>
      </div>

      {/* Lifestyle & Habits */}
      <h3>🚬 Lifestyle & Habits</h3>

      <div>
        <label>Do you smoke or use tobacco products?</label><br />
        <div className="radio-group">
          {[ "Never", "Rarely", "Occasionally", "Often", "Regularly" ].map((label, index) => (
            <label key={index}>
              <input type="radio" name="OSQ020A" value={index} onChange={handleInputChange} /> {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label>How often do you consume alcohol?</label><br />
        <div className="radio-group">
          {[ "Never", "Rarely", "Occasionally", "Often", "Regularly" ].map((label, index) => (
            <label key={index}>
              <input type="radio" name="OSQ020B" value={index} onChange={handleInputChange} /> {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label>Do you consume enough eye-healthy nutrients (Vitamin A, C, E, Omega-3)?</label><br />
        <div className="radio-group">
          {[ "Always", "Often", "Sometimes", "Rarely", "Never" ].map((label, index) => (
            <label key={index}>
              <input type="radio" name="OSQ020C" value={index} onChange={handleInputChange} /> {label}
            </label>
          ))}
        </div>
      </div>

      {/* General Eye Symptoms */}
      <h3>👁️ General Eye Symptoms</h3>

      {[
        { question: "How often do you experience headaches after reading or screen use?", name: "OHQ780A" },
        { question: "Do you struggle with night vision, such as difficulty seeing while driving at night?", name: "OHQ780B" },
        { question: "How frequently do you experience blurry vision?", name: "OHQ780C" },
        { question: "Do you feel frequent eye strain or discomfort?", name: "OHQ780D" },
        { question: "How often do you have dry or itchy eyes?", name: "OHQ780E" },
        { question: "Do bright lights cause discomfort (light sensitivity)?", name: "OHQ780F" },
        { question: "Do you experience excessive tearing or watery eyes?", name: "OHQ780G" },
        { question: "How often do you struggle to focus on objects, especially when shifting from near to far?", name: "OHQ780H" },
        { question: "Do you see halos or glare around lights at night?", name: "OHQ780I" },
      ].map(({ question, name }, index) => (
        <div key={index}>
          <label>{question}</label><br />
          <div className="radio-group">
            {[ "Never", "Mild", "Sometimes", "Often", "Always" ].map((label, i) => (
              <label key={i}>
                <input type="radio" name={name} value={i} onChange={handleInputChange} /> {label}
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Critical Symptoms */}
      <h3>⚠️ Critical Symptoms</h3>

      <div>
        <label>Have you experienced severe eye pain or discomfort recently?</label><br />
        <div className="radio-group">
          {[ "Never", "Mild", "Sometimes", "Often", "Severe" ].map((label, index) => (
            <label key={index}>
              <input type="radio" name="OHQ780J" value={index} onChange={handleInputChange} /> {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label>Do you have a personal or family history of serious eye diseases (glaucoma, cataracts, macular degeneration)?</label><br />
        <div className="radio-group">
          {[ "No", "Unsure", "Mild", "Significant", "Severe" ].map((label, index) => (
            <label key={index}>
              <input type="radio" name="OHQ780K" value={index} onChange={handleInputChange} /> {label}
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <center>
        <button type="submit" className="user-data-submit-button">Submit</button>
      </center>
    </form>
      </div>
    </div>
  );
};

export default UserData;
