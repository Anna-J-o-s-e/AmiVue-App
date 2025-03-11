import React, { useState, useEffect } from 'react';
import NavBarUser from './NavBarUser';
import axios from 'axios';

const UserData = () => {
  const [responses, setResponses] = useState({
    troubleSeeing: '',
    historyOfSurgery: '',
    visionProblems: '',
    cataracts: '',
    glaucoma: '',
    macularDegeneration: '',
    diabeticRetinopathy: '',
    visionLimitations: '',
    alcoholConsumption: '',
    physicalActivity: '',
    smokingStatus: '',
    glucoseLevel: '',
    cholesterolLevel: '',
  });

  const [userDetails, setUserDetails] = useState({ fullName: "", age: "", gender: "", userId: "" });

  useEffect(() => {
    fetchUserDetails();
  }, []);
  

  // Fetch user details from local storage
  const fetchUserDetails = () => {
    const userDataString = localStorage.getItem("user");
    if (!userDataString) return;

    const userData = JSON.parse(userDataString);
    const fullName = userData?.fullName || "User";
    const gender = userData?.gender || "Unknown";
    const dob = userData?.dob;
    const userId = userData?._id;

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

    setUserDetails({ fullName, age, gender, userId });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponses({
      ...responses,
      [name]: value
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponses((prevResponses) => ({
      ...prevResponses,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    
    // Validate cholesterol and glucose levels (make sure they are numbers)
    if (isNaN(responses.cholesterolLevel) || isNaN(responses.glucoseLevel)) {
      console.error("Invalid cholesterol or glucose levels.");
      return; // Prevent submission if invalid
    }
  
    const nhanesData = {
      userid: userDetails.userId,
      RIAGENDR: userDetails.gender === 'Male' ? 1 : (responses.gender === 'Female' ? 2 : 0), // Ensure gender value is set properly
      RIDAGEYR: userDetails.age,
      DR1TVD: responses.troubleSeeing === 'Severe' ? 1 : (responses.troubleSeeing === 'Mild' ? 2 : 0),
      AUQ011: responses.troubleSeeing === 'Yes' ? 1 : 0,
      AUQ051: responses.historyOfSurgery === 'Yes' ? 1 : 0,
      AUQ010: responses.visionProblems === 'Yes' ? 1 : 0,
      AUQ020: responses.cataracts === 'Yes' ? 1 : 0,
      AUQ020A: responses.cataracts === 'Yes' ? 1 : 0, // Mapping based on user selection
      AUQ020B: responses.glaucoma === 'Yes' ? 1 : 0,
      AUQ020C: responses.macularDegeneration === 'Yes' ? 1 : 0,
      AUQ020D: responses.diabeticRetinopathy === 'Yes' ? 1 : 0,
      AUQ020E: 0, // Placeholder if there's another condition for AUQ020E
      AUQ041: responses.visionLimitations === 'Yes' ? 1 : 0,
      LBDLDL: responses.cholesterolLevel, // Placeholder for the actual data
      LBXTC: responses.cholesterolLevel, // Placeholder for the actual data
      LBXGLU: responses.glucoseLevel, // Placeholder for the actual data
      ALQ130: responses.alcoholConsumption === 'Severe' ? 1 : (responses.alcoholConsumption === 'Mild' ? 2 : 0),
      PAQ650: responses.physicalActivity === 'Severe' ? 1 : (responses.physicalActivity === 'Mild' ? 2 : 0),
      SMQ040: responses.smokingStatus === 'Yes' ? 1 : 0,
      timestamp: timestamp
    };
  
    console.log("Sending data:", nhanesData); // Log the data being sent for debugging
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/user-data/analyze', nhanesData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      // The response from axios is already parsed as JSON
      const result = response.data;
  
      if (response.status === 200) {
        console.log(result.prediction);  // Handle the prediction result here
        // You can use the result to update the UI or show the user insights.
      } else {
        console.error('Error:', result.error);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error('Error:', error.response || error.message);  // Enhanced error logging
      // Optionally show an error message to the user
    }
  };
  

  return (
    <div>
      <NavBarUser />
      <h2>Eye Health Survey</h2>
      <form onSubmit={handleSubmit}>
      <div>
        <label>Do you have trouble seeing?</label>
        <div>
          <input
            type="radio"
            name="troubleSeeing"
            value="Severe"
            checked={responses.troubleSeeing === 'Severe'}
            onChange={handleInputChange}
          /> Severe
          <input
            type="radio"
            name="troubleSeeing"
            value="Mild"
            checked={responses.troubleSeeing === 'Mild'}
            onChange={handleInputChange}
          /> Mild
          <input
            type="radio"
            name="troubleSeeing"
            value="No"
            checked={responses.troubleSeeing === 'No'}
            onChange={handleInputChange}
          /> No
        </div>
      </div>

      <div>
        <label>Have you had any eye surgery?</label>
        <div>
          <input
            type="radio"
            name="historyOfSurgery"
            value="Yes"
            checked={responses.historyOfSurgery === 'Yes'}
            onChange={handleInputChange}
          /> Yes
          <input
            type="radio"
            name="historyOfSurgery"
            value="No"
            checked={responses.historyOfSurgery === 'No'}
            onChange={handleInputChange}
          /> No
        </div>
      </div>

      <div>
        <label>Do you have any vision problems?</label>
        <div>
          <input
            type="radio"
            name="visionProblems"
            value="Yes"
            checked={responses.visionProblems === 'Yes'}
            onChange={handleInputChange}
          /> Yes
          <input
            type="radio"
            name="visionProblems"
            value="No"
            checked={responses.visionProblems === 'No'}
            onChange={handleInputChange}
          /> No
        </div>
      </div>

      <div>
        <label>Do you have cataracts?</label>
        <div>
          <input
            type="radio"
            name="cataracts"
            value="Yes"
            checked={responses.cataracts === 'Yes'}
            onChange={handleInputChange}
          /> Yes
          <input
            type="radio"
            name="cataracts"
            value="No"
            checked={responses.cataracts === 'No'}
            onChange={handleInputChange}
          /> No
        </div>
      </div>

      <div>
        <label>Do you have glaucoma?</label>
        <div>
          <input
            type="radio"
            name="glaucoma"
            value="Yes"
            checked={responses.glaucoma === 'Yes'}
            onChange={handleInputChange}
          /> Yes
          <input
            type="radio"
            name="glaucoma"
            value="No"
            checked={responses.glaucoma === 'No'}
            onChange={handleInputChange}
          /> No
        </div>
      </div>

      <div>
        <label>Do you have macular degeneration?</label>
        <div>
          <input
            type="radio"
            name="macularDegeneration"
            value="Yes"
            checked={responses.macularDegeneration === 'Yes'}
            onChange={handleInputChange}
          /> Yes
          <input
            type="radio"
            name="macularDegeneration"
            value="No"
            checked={responses.macularDegeneration === 'No'}
            onChange={handleInputChange}
          /> No
        </div>
      </div>

      <div>
        <label>Do you have diabetic retinopathy?</label>
        <div>
          <input
            type="radio"
            name="diabeticRetinopathy"
            value="Yes"
            checked={responses.diabeticRetinopathy === 'Yes'}
            onChange={handleInputChange}
          /> Yes
          <input
            type="radio"
            name="diabeticRetinopathy"
            value="No"
            checked={responses.diabeticRetinopathy === 'No'}
            onChange={handleInputChange}
          /> No
        </div>
      </div>

      <div>
        <label>Do you have vision limitations?</label>
        <div>
          <input
            type="radio"
            name="visionLimitations"
            value="Yes"
            checked={responses.visionLimitations === 'Yes'}
            onChange={handleInputChange}
          /> Yes
          <input
            type="radio"
            name="visionLimitations"
            value="No"
            checked={responses.visionLimitations === 'No'}
            onChange={handleInputChange}
          /> No
        </div>
      </div>

      <div>
        <label>Cholesterol Level (mg/dL)</label>
        <input
          type="number"
          name="cholesterolLevel"
          value={responses.cholesterolLevel}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Glucose Level (mg/dL)</label>
        <input
          type="number"
          name="glucoseLevel"
          value={responses.glucoseLevel}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Alcohol Consumption</label>
        <div>
          <input
            type="radio"
            name="alcoholConsumption"
            value="Severe"
            checked={responses.alcoholConsumption === 'Severe'}
            onChange={handleInputChange}
          /> Severe
          <input
            type="radio"
            name="alcoholConsumption"
            value="Mild"
            checked={responses.alcoholConsumption === 'Mild'}
            onChange={handleInputChange}
          /> Mild
          <input
            type="radio"
            name="alcoholConsumption"
            value="None"
            checked={responses.alcoholConsumption === 'None'}
            onChange={handleInputChange}
          /> None
        </div>
      </div>

      <div>
        <label>Physical Activity</label>
        <div>
          <input
            type="radio"
            name="physicalActivity"
            value="Severe"
            checked={responses.physicalActivity === 'Severe'}
            onChange={handleInputChange}
          /> Severe
          <input
            type="radio"
            name="physicalActivity"
            value="Mild"
            checked={responses.physicalActivity === 'Mild'}
            onChange={handleInputChange}
          /> Mild
          <input
            type="radio"
            name="physicalActivity"
            value="None"
            checked={responses.physicalActivity === 'None'}
            onChange={handleInputChange}
          /> None
        </div>
      </div>

      <div>
        <label>Do you smoke?</label>
        <div>
          <input
            type="radio"
            name="smokingStatus"
            value="Yes"
            checked={responses.smokingStatus === 'Yes'}
            onChange={handleInputChange}
          /> Yes
          <input
            type="radio"
            name="smokingStatus"
            value="No"
            checked={responses.smokingStatus === 'No'}
            onChange={handleInputChange}
          /> No
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default UserData;
