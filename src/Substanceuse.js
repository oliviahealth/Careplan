import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const SubstanceUseServices = () => {
  const { authenticated } = useAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(4).fill(''));

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

  const handleInputChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = event.target.value;
    setAnswers(newAnswers);
  };

  return (
    <div className="maternal-demographics-card">
      {authenticated ? (
        <>
          <h2>Services for Substance Use</h2>
          {formSubmitted ? (
            <p>Thank you for submitting the form!</p>
          ) : (
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
                        onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
              )}
              {/* Additional questions */}
              {answers[0] === 'Prior Use' && currentQuestionIndex === 0 && (
             <div>
                 <p>Date of Last use:</p>
                <input
                     type="text"
                     value={answers[1]}
                     onChange={(event) => handleInputChange(event, 1)}
                 />
                 <p>Medication(s) and Dose:</p>
                <input
                    type="text"
                    value={answers[2]}
                    onChange={(event) => handleInputChange(event, 2)}
                 />
                </div>
                )}
                {answers[1] === 'Prior Use' && currentQuestionIndex === 1 && (
                 <div>
                    <p>Date of Last Appointment:</p>
                    <input
                        type="text"
                        value={answers[2]}
                        onChange={(event) => handleInputChange(event, 2)}
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
        </>
      ) : (
        <p>You are not authorized to access this page.</p>
      )}
    </div>
  );
};

export default SubstanceUseServices;

