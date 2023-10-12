import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Import the useAuth hook

const MedicalHistory = () => {
  const { authenticated } = useAuth(); // Get the authenticated state from the context

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
    <div className="medical-history">
      {authenticated ? ( // Check if the user is authenticated
        <>
          <h2>Medical History</h2>
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
                      <button onClick={handleNextClick}>Next</button>
                    </div>
                  </>
                ) : answerTypes[currentQuestionIndex] === 'number' ? (
                  <>
                    <input
                      type="number"
                      value={answers[currentQuestionIndex]}
                      onChange={handleInputChange}
                    />
                    <div>
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
                      <button onClick={handleNextClick}>Next</button>
                    </div>
                  </>
                ) : answerTypes[currentQuestionIndex] === 'radio' ? (
                  <>
                    {modeOfDeliveryOptions.map((option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          value={option}
                          checked={answers[currentQuestionIndex] === option}
                          onChange={handleRadioChange}
                        />
                        {option}
                      </label>
                    ))}
                    <div>
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

export default MedicalHistory;

