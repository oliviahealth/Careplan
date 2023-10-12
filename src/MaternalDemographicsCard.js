import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Import the useAuth hook


const MaternalDemographicsCard = () => {
  const { authenticated } = useAuth();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(9).fill(''));
  const [emergencyContact, setEmergencyContact] = useState({
    phone: '',
    address: '',
    name: '',
  });

  const questions = [
    'Name:',
    'Date of Birth:',
    'Current Living Arrangement:',
    'Street Address:',
    'Primary Phone Number:',
    'Phone Number:',
    'Emergency Contact (Name, Phone number, Address):',
    'Marital Status:',
    'Do you have insurance:',
  ];

  const answerTypes = [
    'text', // Name
    'date', // Date of Birth (Changed to date input)
    'radio', // Current Living Arrangement
    'text', // Street Address
    'tel', // Updated input type for Primary Phone Number
    'tel', // Updated input type for Phone Number
    'group', // Group for Emergency Contact
    'radio', // Marital Status
    'radio', // Do you have insurance
  ];

  // Additional options for 'Current Living Arrangement'
  const currentLivingArrangementOptions = [
    'Rent/Own a Home',
    'Living with Relatives or Friends',
    'Residential Treatment Center',
    'Correctional Facility',
    'Emergency Shelter',
    'Homeless',
    'Other',
  ];

  // Options for 'Marital Status' and 'Do you have insurance'
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];

  const insuranceOptions = ['Yes', 'No'];

  const handleNextClick = () => {
    // Move to the next question
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleInputChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = event.target.value;

    // Update the answers array when the user types
    setAnswers(newAnswers);
  };

  const handleRadioChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = event.target.value;

    // Update the answers array when the user selects a radio option
    setAnswers(newAnswers);
  };

  const handleGroupInputChange = (event, field) => {
    const updatedEmergencyContact = { ...emergencyContact, [field]: event.target.value };
    setEmergencyContact(updatedEmergencyContact);
  };

  const handleEnterClick = () => {
    // Record the data and move to the next question when the Enter button is clicked
    handleNextClick();
  };

  return (
    <div className="maternal-demographics-card">
      {authenticated ? ( // Check if the user is authenticated
        <>
          <h2>Maternal Demographics - Section to be included</h2>
          <div className="question-container">
            {currentQuestionIndex < questions.length ? (
              <>
                <p>{questions[currentQuestionIndex]}</p>
                {answerTypes[currentQuestionIndex] === 'text' ? (
                  <>
                    <input
                      type="text"
                      value={answers[currentQuestionIndex]}
                      onChange={handleInputChange}
                    />
                    <div>
                      <button onClick={handleEnterClick}>Enter</button>
                      <button onClick={handleNextClick}>Next</button>
                    </div>
                  </>
                ) : answerTypes[currentQuestionIndex] === 'date' ? (
                  <>
                    <input
                      type="date"
                      value={answers[currentQuestionIndex]}
                      onChange={handleInputChange}
                    />
                    <div>
                      <button onClick={handleEnterClick}>Enter</button>
                      <button onClick={handleNextClick}>Next</button>
                    </div>
                  </>
                ) : answerTypes[currentQuestionIndex] === 'radio' ? (
                  <div>
                    {currentQuestionIndex === 2 ? ( // Check if it's the 'Current Living Arrangement' question
                      currentLivingArrangementOptions.map((option) => (
                        <label key={option}>
                          <input
                            type="radio"
                            value={option}
                            checked={answers[currentQuestionIndex] === option}
                            onChange={handleRadioChange}
                          />
                          {option}
                        </label>
                      ))
                    ) : currentQuestionIndex === 7 ? ( // Check if it's the 'Marital Status' question
                      maritalStatusOptions.map((option) => (
                        <label key={option}>
                          <input
                            type="radio"
                            value={option}
                            checked={answers[currentQuestionIndex] === option}
                            onChange={handleRadioChange}
                          />
                          {option}
                        </label>
                      ))
                    ) : currentQuestionIndex === 8 ? ( // Check if it's the 'Do you have insurance?' question
                      insuranceOptions.map((option) => (
                        <label key={option}>
                          <input
                            type="radio"
                            value={option}
                            checked={answers[currentQuestionIndex] === option}
                            onChange={handleRadioChange}
                          />
                          {option}
                        </label>
                      ))
                    ) : null}
                    <div>
                      <button onClick={handleEnterClick}>Enter</button>
                      <button onClick={handleNextClick}>Next</button>
                    </div>
                  </div>
                ) : answerTypes[currentQuestionIndex] === 'tel' ? (
                  <>
                    <input
                      type="tel" // Use 'tel' type for phone number
                      value={answers[currentQuestionIndex]}
                      onChange={handleInputChange}
                    />
                    <div>
                      <button onClick={handleEnterClick}>Enter</button>
                      <button onClick={handleNextClick}>Next</button>
                    </div>
                  </>
                ) : answerTypes[currentQuestionIndex] === 'group' ? (
                  <>
                    <input
                      type="text"
                      placeholder="Name"
                      value={emergencyContact.name}
                      onChange={(e) => handleGroupInputChange(e, 'name')}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={emergencyContact.phone}
                      onChange={(e) => handleGroupInputChange(e, 'phone')}
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={emergencyContact.address}
                      onChange={(e) => handleGroupInputChange(e, 'address')}
                    />
                    <div>
                      <button onClick={handleEnterClick}>Enter</button>
                      <button onClick={handleNextClick}>Next</button>
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <p> Thank you!</p>
            )}
          </div>
        </>
      ) : (
        <p>You are not authorized to access this page.</p>
      )}
    </div>
  );
};

export default MaternalDemographicsCard;
