import React, { useState } from 'react';

const SocialSupportCard = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [goals, setGoals] = useState('');
  const [provideAdditionalInfo, setProvideAdditionalInfo] = useState('');
  const [currentSupport, setCurrentSupport] = useState('');
  const [relationshipFeelings, setRelationshipFeelings] = useState('');

  const questions = [
    'How many people live in your home?',
    'Details of People in Home (Full Name, Date of Birth, Relationship)',
    'Do any of your children live out of your home? If so select how many:',
    'Details of Children Outside Home (Full Name, Date of Birth, Address)',
    'What are your goals? (Parenting, Breastfeeding, Recovery, Etc.)',
    'Would you like to provide additional information about your support system?',
    'Who is there as your current support? (Can be friends, family, community, recovery, etc. members)',
    'How do these relationships make you feel?',
    'Thank you!',
  ];

  const handleNextClick = () => {
    if (
      (currentQuestionIndex === 0 && peopleCount === 0) ||
      (currentQuestionIndex === 2 && childrenCount === 0)
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 2);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousClick = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleSubmit = () => {
    const formData = {
      peopleCount,
      childrenCount,
      goals,
      provideAdditionalInfo,
      currentSupport,
      relationshipFeelings,
    };
    console.log(formData);

    // fetch('/backend-endpoint', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formData),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   });
  };

  return (
    <div className="bg-white border-4d0000 border-8 rounded-lg p-4 mx-auto max-w-screen-md text-center">
      <h2 className = "headerstyle">Social Support</h2>
      <div className="question-container">
        <p>{questions[currentQuestionIndex]}</p>
        {currentQuestionIndex === 0 && (
          <select onChange={(e) => setPeopleCount(Number(e.target.value))}>
            {[...Array(11).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        )}
        {currentQuestionIndex === 1 &&
          [...Array(peopleCount)].map((_, idx) => (
            <div key={idx}>
              <p>Person {idx + 1}:</p>
              <input placeholder="Full name" />
              <input type="date" placeholder="Date of Birth" />
              <input placeholder="Relationship" />
            </div>
          ))}
        {currentQuestionIndex === 2 && (
          <select onChange={(e) => setChildrenCount(Number(e.target.value))}>
            {[...Array(11).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        )}
        {currentQuestionIndex === 3 && childrenCount !== 0 &&
          [...Array(childrenCount)].map((_, idx) => (
            <div key={idx}>
              <p>Child {idx + 1}:</p>
              <input placeholder="Full name" />
              <input type="date" placeholder="Date of Birth" />
              <input placeholder="Address" />
            </div>
          ))}
        {currentQuestionIndex === 4 && (
          <input
            type="text"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Goals"
          />
        )}
        {currentQuestionIndex === 5 && (
          <>
            <label>
              <input
                type="radio"
                value="yes"
                checked={provideAdditionalInfo === 'yes'}
                onChange={() => setProvideAdditionalInfo('yes')}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={provideAdditionalInfo === 'no'}
                onChange={() => {
                  setProvideAdditionalInfo('no');
                  setCurrentQuestionIndex(8);
                }}
              />
              No
            </label>
          </>
        )}
        {(currentQuestionIndex === 6 || currentQuestionIndex === 7) && (
          <textarea
            placeholder={
              currentQuestionIndex === 6
                ? 'Who is there as your current support?'
                : 'How do these relationships make you feel?'
            }
            value={
              currentQuestionIndex === 6 ? currentSupport : relationshipFeelings
            }
            onChange={(e) => {
              if (currentQuestionIndex === 6) {
                setCurrentSupport(e.target.value);
              } else {
                setRelationshipFeelings(e.target.value);
              }
            }}
          />
        )}
        {currentQuestionIndex !== 8 && (
          <div>
            {currentQuestionIndex !== 0 && (
              <button onClick={handlePreviousClick}>Previous</button>
            )}
            <button onClick={handleNextClick}>Next</button>
          </div>
        )}
        {currentQuestionIndex === 8 && (
          <button onClick={handleSubmit}>Enter</button>
        )}
      </div>
    </div>
  );
};

export default SocialSupportCard;
