import axios from 'axios';
import React, { useState } from 'react';
import './ProffessionalSignUp.css';

const ProfessionalSignUp = () => {
  const [data, setData] = useState({
    fullName: '',
    username: '',
    dob: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    gender: '',
    profession: '',
    workingPlace: '',
    yearsOfExperience: '',
    preferredContactTime: '',
    profilePicture: '',
    agreePolicy: false,
  });

  const [previewImage, setPreviewImage] = useState(
    'https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png'
  );
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const inputHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setData({ ...data, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return passwordPattern.test(password);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!data.fullName) newErrors.fullName = 'Full name is required';
    if (!data.username) newErrors.username = 'Username is required';
    if (!data.dob) newErrors.dob = 'Date of birth is required';
    if (!data.email) newErrors.email = 'Email address is required';
    if (!validateEmail(data.email)) newErrors.email = 'Please enter a valid email address.';
    if (!data.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
    if (!validatePhoneNumber(data.mobileNumber)) newErrors.mobileNumber = 'Please enter a valid phone number (10 digits).';
    if (!data.profession) newErrors.profession = 'Profession is required';
    if (!data.workingPlace) newErrors.workingPlace = 'Working place is required';
    if (!data.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
    if (!data.preferredContactTime) newErrors.preferredContactTime = 'Preferred contact time is required';
    if (!data.password) newErrors.password = 'Password is required';
    if (!validatePassword(data.password)) newErrors.password = 'Password must be at least 6 characters long, contain one uppercase letter, and one special character.';
    if (data.password !== data.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!data.agreePolicy) newErrors.agreePolicy = 'You must agree to the health policy';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const readValue = async () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('username', data.username);
      formData.append('dob', data.dob);
      formData.append('email', data.email);
      formData.append('mobileNumber', data.mobileNumber);
      formData.append('gender', data.gender);
      formData.append('profession', data.profession);
      formData.append('workingPlace', data.workingPlace);
      formData.append('yearsOfExperience', data.yearsOfExperience);
      formData.append('preferredContactTime', data.preferredContactTime);
      formData.append('password', data.password);
      formData.append('agreePolicy', data.agreePolicy);
      if (data.profilePicture) {
        formData.append('profilePicture', data.profilePicture);
      }

      try {
        const response = await axios.post('http://localhost:8080/professionalsignup', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Log the response for detailed error handling
        console.log(response.data);

        if (response.data.status === 'success') {
          alert('Successfully signed up');
        } else {
          alert('Error signing up: ' + response.data.message); // Assuming your backend sends a message
        }
      } catch (error) {
        console.error('Error during signup:', error.response || error); // Log full error for debugging
        alert('An error occurred while signing up.');
      }
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="proffessional-signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Create Your Professional Account</h2>
        <p className="signup-subtitle">Join us and contribute to better eye health management</p>

        <div className="profile-picture-container">
          <img src={previewImage} alt="Profile Preview" className="profile-picture" />
          <input
            type="file"
            accept="image/*"
            name="profilePicture"
            onChange={handleProfilePictureChange}
            className="profile-upload"
          />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); readValue(); }}>
          <div className="form-grid">
            <div className="form-column">
              <div className="signup-input-container">
                <label className="signup-input-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={data.fullName}
                  onChange={inputHandler}
                  className={`signup-input-box ${errors.fullName ? 'error' : ''}`}
                />
                {errors.fullName && <p className="error-message">{errors.fullName}</p>}
              </div>

              <div className="signup-input-container">
                <label className="signup-input-label">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={data.dob}
                  onChange={inputHandler}
                  className={`signup-input-box ${errors.dob ? 'error' : ''}`}
                />
                {errors.dob && <p className="error-message">{errors.dob}</p>}
              </div>

              <div className="signup-input-container">
                <label className="signup-input-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={inputHandler}
                  className={`signup-input-box ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>

              <div className="signup-input-container">
                <label className="signup-input-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={inputHandler}
                  className={`signup-input-box ${errors.password ? 'error' : ''}`}
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
              </div>
            </div>

            <div className="form-column">
              <div className="signup-input-container">
                <label className="signup-input-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={data.username}
                  onChange={inputHandler}
                  className={`signup-input-box ${errors.username ? 'error' : ''}`}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
              </div>

              <div className="signup-input-container">
                <label className="signup-input-label">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={data.mobileNumber}
                  onChange={inputHandler}
                  className={`signup-input-box ${errors.mobileNumber ? 'error' : ''}`}
                />
                {errors.mobileNumber && <p className="error-message">{errors.mobileNumber}</p>}
              </div>

              <div className="signup-input-container">
                <label className="signup-input-label">Gender</label>
                <select
                  name="gender"
                  value={data.gender}
                  onChange={inputHandler}
                  className={`signup-input-box ${errors.gender ? 'error' : ''}`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="error-message">{errors.gender}</p>}
              </div>

              <div className="signup-input-container">
                <label className="signup-input-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={inputHandler}
                  className={`signup-input-box ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </div>
            </div>
            <div className="signup-input-container preferred-contact-time">
  <label className="signup-input-label">Preferred Contact Time</label>
  <input
    type="text"  
    name="preferredContactTime"
    value={data.preferredContactTime}
    onChange={inputHandler}
    className={`signup-input-box ${errors.preferredContactTime ? 'error' : ''}`}
  />
  {errors.preferredContactTime && <p className="error-message">{errors.preferredContactTime}</p>}
</div>

<div className="signup-input-container years-of-experience">
  <label className="signup-input-label">Years of Experience</label>
  <input
    type="number"  // Changed to number input type
    name="yearsOfExperience"
    value={data.yearsOfExperience}
    onChange={inputHandler}
    className={`signup-input-box ${errors.yearsOfExperience ? 'error' : ''}`}
  />
  {errors.yearsOfExperience && <p className="error-message">{errors.yearsOfExperience}</p>}
</div>

<div className="signup-input-container workplace">
  <label className="signup-input-label">Working Place</label>
  <textarea
    name="workingPlace"
    value={data.workingPlace}
    onChange={inputHandler}
    className={`signup-input-box workplace ${errors.workingPlace ? 'error' : ''}`}
  />
  {errors.workingPlace && <p className="error-message">{errors.workingPlace}</p>}
</div>

          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              name="agreePolicy"
              checked={data.agreePolicy}
              onChange={inputHandler}
            />
            <br/>
            <br/>
            <label>
              I agree to the Health Data Usage Policy
              &nbsp;
              <span className="know-more-link" onClick={toggleModal}>Know More</span>
            </label>
            {errors.agreePolicy && <p className="error-message">{errors.agreePolicy}</p>}
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={toggleModal}>X</button>
            <h3>Privacy Policy</h3>
            <p>Effective Date: 28-01-2025</p>
            <p>At AmiVue, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, store, and protect your data when you use our services. By using AmiVue, you agree to the collection and use of information in accordance with this policy.
            1. Information We Collect
We collect the following information when you use AmiVue:

Personal Information: This may include your name, email address, and other details you provide when registering or using the app.
Health Information: This includes the images you upload (such as your eye images) and any health-related information you share in response to questions or tests.
2. How We Use Your Information:
We use your information for the following purposes:

To analyze and provide recommendations based on your eye health data.
To improve our app by understanding how you use it and gathering feedback.
To communicate with you if necessary, for example, to update you on features or changes.
3. Data Security
We take reasonable steps to protect your data, but please remember that no method of transmission over the internet is 100% secure. While we do our best to keep your information safe, we cannot guarantee complete security.

4. Data Retention
Your personal and health data will be stored for as long as necessary for the purpose of providing our services. If you no longer want to use the app, you can choose to stop using it, and we will remove your data upon request.

5. Sharing Your Information
We do not share your information with third parties, except:

If we are legally required to do so (such as in response to a court order).
6. Cookies and Tracking
We may use cookies to improve your experience with the app. You can disable cookies through your browser, but this may affect the functionality of the app.

7. Your Rights
You have the right to:

Access your personal information if you need to see what data we have collected.
Request deletion of your personal information by contacting us (if this applies to your situation).
8. Changes to This Policy
We may update this privacy policy from time to time. When we do, we will post the updated policy here with an updated "Effective Date."</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalSignUp;
