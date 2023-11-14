import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const SubstanceUseServices = () => {
  const { authenticated } = useAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(4).fill(''));
  const [additionalDetails, setAdditionalDetails] = useState(['', '', '']);

  const questions = [
    'Medication Assisted Treatment (MAT) Engaged:',
    'Addiction Medicine Services:',
    'Name and Contact Information for MAT Clinic:',
    'Name and Contact Information for Addiction Medicine Clinic:',
  ];

  const answerTypes = ['radio', 'radio', 'text', 'text'];
  const priorUseOptions = ['Never', 'Currently', 'Prior Use'];

  const handleNextClick = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousClick = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleFinalSubmit = async () => {
    // Log the answers
    console.log(answers);
    setFormSubmitted(true);
    // Prepare the data to be sent to the backend
    const formData = {
      answers: answers,
      // Add any other data you want to send
    };

    try {
      // Send a POST request to the backend
      const response = await fetch('/api/plan-of-safe-care/services-for-substance-use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if the request was successful
      if (response.ok) {
        console.log('Data sent successfully!');
        setFormSubmitted(true); // Mark the form as submitted
      } else {
        console.error('Failed to send data to the backend:', await response.text());
      }
    } catch (error) {
      console.error('An error occurred while sending data to the backend:', error);
    }
  };

  const handleInputChange = (event, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleDetailsChange = (event, index) => {
    const newDetails = [...additionalDetails];
    newDetails[index] = event.target.value;
    setAdditionalDetails(newDetails);
  };

  return (
    <div className="bg-white border-4d0000 border-8 rounded-lg p-4 mx-auto max-w-screen-md text-center">
      {authenticated ? (
        <>
          <h2 className="headerstyle">Services for Substance Use</h2>
          {!formSubmitted && (
            <div className="question-container">
              <p>{questions[currentQuestionIndex]}</p>
              {answerTypes[currentQuestionIndex] === 'radio' && (
                <div>
                  {priorUseOptions.map((option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        value={option}
                        checked={answers[currentQuestionIndex] === option}
                        onChange={(e) => handleInputChange(e, currentQuestionIndex)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
              {answerTypes[currentQuestionIndex] === 'text' && (
                <input
                  type="text"
                  value={answers[currentQuestionIndex]}
                  onChange={(e) => handleInputChange(e, currentQuestionIndex)}
                />
              )}
              {/* Additional questions */}
              {answers[currentQuestionIndex] === 'Prior Use' && currentQuestionIndex === 0 && (
                <div>
                  <p>Date of Last use:</p>
                  <input
                    type="text"
                    value={additionalDetails[0]}
                    onChange={(e) => handleDetailsChange(e, 0)}
                  />
                  <p>Medication(s) and Dose:</p>
                  <input
                    type="text"
                    value={additionalDetails[1]}
                    onChange={(e) => handleDetailsChange(e, 1)}
                  />
                </div>
              )}
              {answers[currentQuestionIndex] === 'Prior Use' && currentQuestionIndex === 1 && (
                <div>
                  <p>Date of Last Appointment:</p>
                  <input
                    type="text"
                    value={additionalDetails[2]}
                    onChange={(e) => handleDetailsChange(e, 2)}
                  />
                </div>
              )}
              <div>
                {currentQuestionIndex > 0 && (
                  <button onClick={handlePreviousClick}>Previous</button>
                )}
                {currentQuestionIndex < questions.length - 1 ? (
                  <button onClick={handleNextClick}>Next</button>
                ) : (
                  <button onClick={handleFinalSubmit}>Enter</button>
                )}
              </div>
            </div>
          )}
            {formSubmitted && (
            <p>Thank you for submitting the form!</p>
          )}
        </>
      ) : (
        <p>You are not authorized to access this page.</p>
      )}
    </div>
  );
};

export default SubstanceUseServices;
