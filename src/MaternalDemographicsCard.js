import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Import the useAuth hook


const MaternalDemographicsCard = () => {
  const { authenticated } = useAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);
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
  
  const handlePreviousClick = () => {
    // Move to the previous question
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleFinalSubmit = async () => {
    console.log(answers, emergencyContact);
    setFormSubmitted(true);

    try {
        const response = await fetch('/api/plan-of-safe-care/maternal-demographics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answers: answers,
                emergencyContact: emergencyContact,
            }),
        });

        if (response.status === 200) {
            console.log('Data sent successfully');
        } else {
            console.error('Error sending data');
        }
    } catch (error) {
        console.error('There was an error sending the data:', error);
    }
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

  useEffect(() => {
    const checkIfFormSubmitted = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve the user ID from local storage
      try {
        const response = await fetch(`/api/check-form-submission/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          setFormSubmitted(data.submitted); // Set the form submission status
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error checking form submission:', error);
      } finally {
        setIsLoading(false); // Set loading to false after the check
      }
    };
    checkIfFormSubmitted();
    }, []);

  if (formSubmitted) {
    return (
        <div className="maternal-demographics-card">
            <p>Thank you for submitting the form!</p>
        </div>
    );
  }

  return (
    <div className="maternal-demographics-card">
        {authenticated ? (
            <>
                <h2>Maternal Demographics </h2>
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

                        {answerTypes[currentQuestionIndex] === 'date' && (
                            <input
                                type="date"
                                value={answers[currentQuestionIndex]}
                                onChange={handleInputChange}
                            />
                        )}

                        {answerTypes[currentQuestionIndex] === 'radio' && currentQuestionIndex === 2 && (
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
                        )}

                        {answerTypes[currentQuestionIndex] === 'radio' && currentQuestionIndex === 7 && (
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
                        )}

                        {answerTypes[currentQuestionIndex] === 'radio' && currentQuestionIndex === 8 && (
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
                        )}

                        {answerTypes[currentQuestionIndex] === 'tel' && (
                            <input
                                type="tel"
                                value={answers[currentQuestionIndex]}
                                onChange={handleInputChange}
                            />
                        )}

                        {answerTypes[currentQuestionIndex] === 'group' && (
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
                            </>
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

export default MaternalDemographicsCard;
