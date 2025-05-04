import React, { useState, useEffect } from "react";
import axios from "axios";

const IshiharaTest = () => {
  const [testImages, setTestImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [responseTimes, setResponseTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTestImages();
  }, []);

  useEffect(() => {
    if (testImages.length > 0 && currentIndex < testImages.length) {
      setImageLoaded(false);
    }
  }, [testImages, currentIndex]);

  const fetchTestImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/ishihara-test");
      console.log("Fetched test images:", response.data);  // Debug log
      setTestImages(response.data);
    } catch (error) {
      console.error("Error fetching test images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setStartTime(Date.now());
  };

  const handleUserResponse = () => {
    if (!inputValue.trim()) {
      alert("Please enter a number before submitting.");
      return;
    }

    const responseTime = (Date.now() - startTime) / 1000;
    const formattedResponse = inputValue.trim().toLowerCase(); // Ensure consistent formatting

    console.log(`User response: "${formattedResponse}" (Time taken: ${responseTime.toFixed(2)}s)`);

    const newResponses = [...userResponses, formattedResponse];
    const newTimes = [...responseTimes, responseTime];

    setUserResponses(newResponses);
    setResponseTimes(newTimes);
    setInputValue("");

    if (currentIndex < testImages.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 100);
    } else {
      submitTest(newResponses, newTimes);
    }
  };

  const submitTest = async (finalResponses, finalTimes) => {
    setSubmitError(null);
    setTestCompleted(true);
    setIsSubmitting(true);

    const userDataString = localStorage.getItem("user");
    if (!userDataString) {
      setSubmitError("User not logged in. Cannot save results.");
      return;
    }

    const userData = JSON.parse(userDataString);
    const userId = userData?._id;

    if (!userId) {
      setSubmitError("User ID not found. Cannot save results.");
      return;
    }

    const testData = {
      user_id: userId,
      user_responses: finalResponses,
      response_times: finalTimes,
      timestamp: new Date().toISOString()
    };

    console.log("Submitting test data:", testData);  // Debug log before sending

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/ishihara-test/submit",
        testData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log("Server response:", response.data);  // Debug log for backend response
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting test:", error);
      setSubmitError(
        error.response ? `Server error: ${error.response.status} - ${error.response.data}` : `Error: ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUserResponse();
    }
  };

  if (loading) return <div className="container"><h1>Loading test images...</h1></div>;

  return (
    <div className="container">
      <h1>Ishihara Color Blindness Test</h1>
      <p>Progress: {currentIndex + 1} of {testImages.length}</p>

      {!testCompleted && testImages.length > 0 && currentIndex < testImages.length && (
        <div>
          <div style={{ position: 'relative', minHeight: '300px' }}>
            <img 
              src={`data:image/png;base64,${testImages[currentIndex].image}`} 
              alt="Ishihara Plate" 
              width="300"
              onLoad={handleImageLoad}
              style={{ display: 'block', margin: '0 auto' }}
            />
            {!imageLoaded && <div>Loading image...</div>}
          </div>
          
          <p>Type the number you see and press Enter:</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ padding: '8px', fontSize: '16px' }}
              autoFocus
              disabled={isSubmitting}
            />
            <button 
              onClick={handleUserResponse}
              style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {testCompleted && submitError && (
        <div className="error-container">
          <h3>Error Submitting Test</h3>
          <p>{submitError}</p>
        </div>
      )}

      {testCompleted && result && (
        <div>
          <h2>Test Results</h2>
          <p><strong>Score:</strong> {Math.min(result.score, 15)} / 15</p> 
          <p><strong>Condition:</strong> {result.color_blindness_condition}</p>
          <p><strong>Abnormalities:</strong> {result.abnormalities}</p>
          <p><strong>Reason:</strong> {result.abnormalities_reason}</p>
          <p><strong>Avg Response Time:</strong> {result.average_response_time.toFixed(2)} sec</p>
        </div>
      )}
    </div>
  );
};

export default IshiharaTest;
