import React from "react";
import { Link } from "react-router-dom";
import "./TakeATest.css"; // Import normal CSS
import NavBarUser from "./NavBarUser";

const tests = [
  {
    id: "visual-acuity",
    name: "Visual Acuity Test",
    description: "Check your ability to distinguish small details and identify digits at various sizes.",
    route: "/visualacuitytest",
  },
  {
    id: "color-blindness",
    name: "Color Blindness Test",
    description: "Evaluate your ability to perceive colors using Ishihara plates.",
    route: "/color-blindness-test",
  },
];

const TakeATest = () => {
  return (
    <div>
      <NavBarUser />
      <div className="take-a-test-container">
        <h1 className="take-a-test-heading">Take a Test</h1>
        <p className="take-a-test-description">
          Choose a test to evaluate different aspects of your vision.
        </p>

        <div className="take-a-test-grid">
          {tests.map((test) => (
            <div key={test.id} className="take-a-test-card">
              <h2 className="take-a-test-title">{test.name}</h2>
              <p className="take-a-test-description-text">{test.description}</p>
              <Link to={test.route} className="take-a-test-button">
                Start Test
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeATest;
