import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./VisualAcuityTest.css"; // Import the CSS file
import NavBarUser from "./NavBarUser";

const TOTAL_TESTS = 15;

const VisualAcuityTest = () => {
    const [digit, setDigit] = useState(null);
    const [size, setSize] = useState(50);
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [testCount, setTestCount] = useState(0);
    const [results, setResults] = useState([]);
    const [testCompleted, setTestCompleted] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [isSaving, setIsSaving] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {

        fetchNewTest();
    }, []);

    const SNELLEN_SIZES = [80, 64, 48, 32, 24, 18, 12, 9]; // Mimic Snellen chart sizes
let shuffledSizes = []; // To track used sizes

const sizeBuckets = {
    small: [10, 12, 15, 18, 20, 25], // Small sizes (twice)
    medium: [30, 35, 40, 45], // Medium sizes (once)
    large: [50, 55, 60, 65, 70] // Large sizes (once)
};

let attempts = [];
let smallDigitCounter = 0; // To ensure small sizes appear twice

const fetchNewTest = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/visual-acuity/new-test");
        setDigit(response.data.digit);

        let selectedSize;
        if (smallDigitCounter < 2) {
            // Pick a small size twice before moving to medium/large
            selectedSize = sizeBuckets.small[Math.floor(Math.random() * sizeBuckets.small.length)];
            smallDigitCounter++;
        } else {
            // Pick from medium or large (single occurrence)
            const combinedSizes = [...sizeBuckets.medium, ...sizeBuckets.large];
            selectedSize = combinedSizes[Math.floor(Math.random() * combinedSizes.length)];
            smallDigitCounter = 0; // Reset counter after switching to large/medium
        }

        setSize(selectedSize);
        setStartTime(Date.now());
        setUserInput("");

    } catch (error) {
        console.error("Error fetching new test:", error);
    }
};


    
const handleSubmit = () => {
  if (!userInput) {
      alert("Please enter a digit.");
      return;
  }

  const responseTime = (Date.now() - startTime) / 1000; // in seconds

  // Convert both to lowercase to ignore case sensitivity
  const isCorrect = userInput.toLowerCase() === digit.toLowerCase();

  console.log(`Actual: ${digit}, User Selected: ${userInput}, Correct: ${isCorrect}`);

  const newResult = { 
      actual_digit: digit, 
      user_selected: userInput, 
      digit_size: size, 
      response_time: responseTime,
      correct: isCorrect
  };

  // Update results
  const updatedResults = [...results, newResult];

  // Count correct answers
  const updatedCorrectCount = updatedResults.filter(result => result.correct).length;

  console.log(`Updated Correct Count: ${updatedCorrectCount}`);

  // Update state
  setResults(updatedResults);
  setCorrectAnswers(updatedCorrectCount);
  setTestCount(prevCount => prevCount + 1);

  // Handle test completion
  if (updatedResults.length === TOTAL_TESTS) {
      setTestCompleted(true);
      saveResults(updatedResults);
  } else {
      fetchNewTest();
  }
};

const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission if inside a form
            handleSubmit(); // Trigger submit on Enter key press
        }
    };
    
    const saveResults = async (finalResults) => {
        setIsSaving(true); // Indicate saving process

        try {
            const userDataString = localStorage.getItem("user");
    
            if (!userDataString) {
                alert("User not logged in. Cannot save results.");
                return;
            }
    
            const userData = JSON.parse(userDataString);
            const userId = userData?._id;
    
            if (!userId) {
                alert("User ID not found. Cannot save results.");
                return;
            }

            const response = await axios.post("http://localhost:5000/api/visual-acuity/save-results", {
                user_id: userId,
                results: finalResults,
            });

            if (response.status === 200) {
                console.log("✅ Test results successfully saved.");
                console.log("📋 Saved Data:", finalResults);
            } else {
                console.log("⚠️ Failed to save results. Response:", response);
            }
        } catch (error) {
            console.error("❌ Error saving results:", error);
        } finally {
            setIsSaving(false); // Reset saving state
        }
    };

    return (
        <div>
            <NavBarUser />
            <div className="visual-test-container">
                <h1 className="visual-test-title">Visual Acuity Test</h1>
               
                {!testCompleted ? (
                    <>
                        <div className="visual-test-box" style={{ fontSize: `${size}px` }}>
                            {digit}
                        </div>
                        <input
                            type="text"
                            className="visual-test-input"
                            placeholder="Enter the letter"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            
                        />
                        <button className="visual-test-button" onClick={handleSubmit} disabled={isSaving}>
                            {isSaving ? "Saving..." : `Submit (${testCount + 1}/${TOTAL_TESTS})`}
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-green-600 font-bold">
                            Test completed! {isSaving ? "Saving results..." : "Your results have been saved."}
                        </p>

                        <button className="visual-test-button" onClick={() => setShowResults(true)} disabled={isSaving}>
                            {isSaving ? "Saving..." : "View Score"}
                        </button>

                        <button className="visual-test-button" onClick={() => navigate("/visualacuityanalysis")} disabled={isSaving}>
                            {isSaving ? "Saving..." : "View Detailed Analysis"}
                        </button>

                        {showResults && (
                            <div className="visual-test-results-container">
                                <p className="visual-test-score">Your Score: {correctAnswers}/{TOTAL_TESTS}</p>
                                <h2 className="text-md font-bold mt-2">Test Details:</h2>
                                <ul className="visual-test-list">
                                    {results.map((result, index) => (
                                        <li key={index}>
                                            Test {index + 1}: 
                                            <span className="font-semibold"> {result.actual_digit} </span> 
                                            (Your Answer: {result.user_selected}) - 
                                            Time: {result.response_time}s
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisualAcuityTest;

