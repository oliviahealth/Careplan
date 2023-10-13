import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Import the useAuth hook

const MedicalHistory = () => {
  const { authenticated } = useAuth(); // Get the authenticated state from the context
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(8).fill(''));

  const questions = [
    'Prenatal Care (for current or most recent pregnancy)',
    'Age at Entry of Care (When you join POSC):',
    'How many weeks pregnant:',
    'Anticipated Delivery Date:',
    'Planned Mode of Delivery: Vaginal / Cesarean',
    'Actual Mode of Delivery: Vaginal / Cesarean',
    'Attended Postpartum Visit: Yes / No',
    'Obstetric History: Please Explain Complications During Prior Pregnancies:',
    'Total Number of Pregnancies:',
    'Number of Live Births:',
    'Number of Children Currently Living with Mother:',
  ];

  const answerTypes = [
    'text',
    'text',
    'number',
    'date',
    'radio',
    'radio',
    'radio',
    'text',
    'number',
    'number',
    'number',
  ];

  const modeOfDeliveryOptions = ['Vaginal', 'Cesarean'];

  const handleNextClick = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };
  const handlePreviousClick = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };
  const handleFinalSubmit = async () => {

    //console log the answers
    console.log(answers);
    // Prepare the data to be sent to the backend
    const formData = {
        answers: answers,
        // Add any other data you want to send
    };

    try {
        // Send a POST request to the backend
        const response = await fetch('/api/plan-of-safe-care/medical-history', {
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

  const handleRadioChange = (event) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = event.target.value;
    setAnswers(newAnswers);
  };

  return (
    <div className="maternal-demographics-card">
        {authenticated ? (
            <>
                <h2>Medical History</h2>
                {formSubmitted ? (
                    <p>Thank you for submitting the form!</p>
                ) : (
                    <div className="question-container">
                        <p>{questions[currentQuestionIndex]}</p>
                        {answerTypes[currentQuestionIndex] === 'text' && (
                            <input
                                type="text"
                                value={answers[currentQuestionIndex]}
                                onChange={handleInputChange}
                            />
                        )}
                        {answerTypes[currentQuestionIndex] === 'number' && (
                            <input
                                type="number"
                                value={answers[currentQuestionIndex]}
                                onChange={handleInputChange}
                            />
                        )}
                        {answerTypes[currentQuestionIndex] === 'date' && (
                            <input
                                type="date"
                                value={answers[currentQuestionIndex]}
                                onChange={handleInputChange}
                            />
                        )}
                        {answerTypes[currentQuestionIndex] === 'radio' && (
                            modeOfDeliveryOptions.map((option) => (
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
                        )}
                        <div>
                            {currentQuestionIndex > 0 && (
                                <button onClick={handlePreviousClick}>Previous</button>
                            )}
                            {currentQuestionIndex < questions.length - 1 ? (
                                <button onClick={handleNextClick}>Next</button>
                            ) : (
                                <button onClick={() => {
                                    handleFinalSubmit();
                                    setFormSubmitted(true);
                                }}>Enter</button>
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

export default MedicalHistory;

