import React, { useState } from "react";
import axios from "axios";
import NavBarUser from "./NavBarUser";
import './Simulation.css';

const Simulation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [condition, setCondition] = useState("");
  const [originalImage, setOriginalImage] = useState(null);
  const [simulatedImage, setSimulatedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const conditions = {
    cataract: {
      name: "Cataract",
      description: "Clouding of the eye's natural lens, leading to blurry vision.",
      causes: "Aging, diabetes, smoking, UV exposure, eye injury.",
      precautions: "Wear UV-protective sunglasses, maintain a healthy diet.",
      aftercare: "Surgery is the primary treatment, followed by regular check-ups."
    },
    color_blindness_protanopia: {
      name: "Protanopia (Red Color Blindness)",
      description: "Difficulty distinguishing red shades.",
      causes: "Genetic inheritance, optic nerve disorders.",
      precautions: "Use color-identifying apps, wear tinted glasses.",
      aftercare: "No complete cure, but adaptive strategies help."
    },
    color_blindness_deuteranopia: {
      name: "Deuteranopia (Green Color Blindness)",
      description: "Inability to distinguish green shades properly.",
      causes: "Genetic mutation affecting cone cells.",
      precautions: "Use special lenses or mobile apps for color identification.",
      aftercare: "Adaptive strategies can help manage daily activities."
    },
    color_blindness_tritanopia: {
      name: "Tritanopia (Blue-Yellow Color Blindness)",
      description: "Difficulty differentiating between blue and yellow shades.",
      causes: "Rare genetic disorder, optic nerve damage.",
      precautions: "Avoid situations where color recognition is crucial.",
      aftercare: "Use contrast-enhancing filters and color-coded labels."
    },
    short_sight_mild: {
      name: "Mild Myopia (Short Sight)",
      description: "Slight difficulty in seeing distant objects.",
      causes: "Genetics, prolonged screen exposure.",
      precautions: "Take regular screen breaks, proper lighting.",
      aftercare: "Use prescribed glasses or lenses."
    },
    short_sight_moderate: {
      name: "Moderate Myopia (Short Sight)",
      description: "Moderate blurring of distant objects.",
      causes: "Increased eye strain, genetics.",
      precautions: "Reduce prolonged screen time, practice eye exercises.",
      aftercare: "Corrective lenses or LASIK surgery for severe cases."
    },
    short_sight_severe: {
      name: "Severe Myopia (Short Sight)",
      description: "Significant difficulty in seeing distant objects.",
      causes: "Eye elongation, excessive near-work activities.",
      precautions: "Frequent eye exams, limited screen time.",
      aftercare: "Strong prescription lenses, surgery in extreme cases."
    },
    long_sight_mild: {
      name: "Mild Hyperopia (Long Sight)",
      description: "Slight difficulty focusing on nearby objects.",
      causes: "Flattened cornea or shorter eye length.",
      precautions: "Avoid prolonged reading without breaks.",
      aftercare: "Reading glasses or vision therapy if needed."
    },
    long_sight_moderate: {
      name: "Moderate Hyperopia (Long Sight)",
      description: "Moderate strain while reading or using screens.",
      causes: "Structural issues with the cornea and lens.",
      precautions: "Use proper lighting and wear prescribed lenses.",
      aftercare: "Regular vision monitoring and optical corrections."
    },
    long_sight_severe: {
      name: "Severe Hyperopia (Long Sight)",
      description: "Severe blurring of close objects, headaches.",
      causes: "Significant corneal abnormalities or aging.",
      precautions: "Use magnifying tools, maintain optimal reading distance.",
      aftercare: "Corrective lenses, laser eye surgery if required."
    },
    blurred_vision: {
      name: "Blurred Vision",
      description: "Loss of sharpness in vision, making objects appear out of focus.",
      causes: "Refractive errors, dry eyes, diabetes, migraines.",
      precautions: "Limit screen time, use artificial tears.",
      aftercare: "Use prescribed glasses or lenses, get regular eye check-ups."
    },
    glaucoma: {
      name: "Glaucoma",
      description: "Damage to the optic nerve due to high eye pressure.",
      causes: "Increased intraocular pressure, genetics, diabetes.",
      precautions: "Regular eye exams, maintaining normal blood pressure.",
      aftercare: "Medication or surgery to control eye pressure."
    },
    macular_degeneration: {
      name: "Macular Degeneration",
      description: "Deterioration of the central part of the retina.",
      causes: "Aging, smoking, high blood pressure.",
      precautions: "Eat a diet rich in leafy greens, avoid smoking.",
      aftercare: "Anti-VEGF injections, low vision aids."
    },
    diabetic_retinopathy: {
      name: "Diabetic Retinopathy",
      description: "Damage to the blood vessels of the retina due to diabetes.",
      causes: "Uncontrolled diabetes, high blood sugar levels.",
      precautions: "Maintain stable blood sugar levels, regular eye exams.",
      aftercare: "Laser therapy, anti-VEGF injections."
    },
    night_blindness: {
      name: "Night Blindness",
      description: "Difficulty seeing in low-light conditions.",
      causes: "Vitamin A deficiency, genetic disorders.",
      precautions: "Eat vitamin A-rich foods, avoid driving at night.",
      aftercare: "Corrective glasses, vitamin supplements."
    },
    astigmatism: {
      name: "Astigmatism",
      description: "Blurred vision due to irregular cornea shape.",
      causes: "Genetics, eye surgery complications.",
      precautions: "Regular vision check-ups, proper eyewear.",
      aftercare: "Corrective lenses, LASIK surgery if needed."
    },
    double_vision: {
      name: "Double Vision (Diplopia)",
      description: "Seeing two overlapping images of the same object.",
      causes: "Nerve damage, stroke, corneal issues.",
      precautions: "Regular neurological check-ups, eye exercises.",
      aftercare: "Eye patches, surgery in severe cases."
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setOriginalImage(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selectedFile || !condition) {
      alert("Please select an image and condition.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("condition", condition);

    try {
      const response = await axios.post("http://127.0.0.1:5000/simulate", formData, {
        responseType: "blob",
      });

      const simulatedUrl = URL.createObjectURL(response.data);
      setSimulatedImage(simulatedUrl);
    } catch (error) {
      alert("Error processing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBarUser />
    <div id="simulationPage">
  
  <div className="content">
    <h1>Eye Condition Simulator</h1>
    
    <select value={condition} onChange={(e) => setCondition(e.target.value)}>
      <option value="">Select Eye Condition</option>
      {Object.keys(conditions).map((key) => (
        <option key={key} value={key}>{conditions[key].name}</option>
      ))}
    </select>

    {condition && conditions[condition] && (
      <div className="info-box">
        <h2>{conditions[condition].name}</h2>
        <p><strong>Description:</strong> {conditions[condition].description}</p>
        <p><strong>Causes:</strong> {conditions[condition].causes}</p>
        <p><strong>Precautions:</strong> {conditions[condition].precautions}</p>
        <p><strong>Aftercare:</strong> {conditions[condition].aftercare}</p>
      </div>
    )}

    {/* File Input */}
    <input type="file" accept="image/*" onChange={handleFileChange} className="border" />

    {/* Display Selected Image */}
    {originalImage && <img src={originalImage} alt="Original" />}

    {/* Buttons */}
    <button className="btn simulate-btn" onClick={handleSubmit} disabled={loading}>
      {loading ? "Processing..." : "Simulate"}
    </button>
    <button className="btn reset-btn" onClick={() => { setSelectedFile(null); setOriginalImage(null); setSimulatedImage(null); setCondition(""); }}>
      Reset
    </button>

    {/* Display Simulated Image */}
    {simulatedImage && <img src={simulatedImage} alt="Simulated" />}
  </div>
</div>
</div>
  );
};

export default Simulation;
