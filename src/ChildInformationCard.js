import React, { Component } from 'react';

class ChildInformationCard extends Component {
  constructor(props) {
    super(props);


    this.state = {
      currentQuestionIndex: 0,
      questions: [
        "Child's Full Name:",
        "Child's Date of Birth:",
        "Child's Gender:", // Added Child's Gender question
        "Child's Relationship to You:",
        "Does the child have any medical conditions? Describe below.",
        "Child's Doctor's Name:",
        "Doctor's Phone Number:", // Added Doctor's Phone Number question
        "Date of Last Doctor Visit:",
        "Did your infant stay at the Neonatal Intensive Care Unit (NICU)?:", // Updated NICU Visit question
        'Infant Urine Drug Screening at Birth', // Updated Infant Urine Drug Screening at Birth
        'Meconium Results', // Updated Meconium Results
        'Neonatal Opioid Withdraw/Neonatal Abstinence Syndrome', // Updated Neonatal Opioid Withdraw/Neonatal Abstinence Syndrome
        "Infant’s Medications",
      ],
      answerTypes: [
        'text', // Child's Full Name
        'date', // Child's Date of Birth
        'radio', // Child's Gender (Added as radio)
        'text', // Child's Relationship to You
        'text', // Does the child have any medical conditions?
        'text', // Child's Doctor's Name
        'tel', // Doctor's Phone Number (Added as tel)
        'date', // Date of Last Doctor Visit
        'radio', // NICU Visit? (Updated to radio)
        'radio', // Infant Urine Drug Screening at Birth (Updated to radio)
        'radio', // Meconium Results (Updated to radio)
        'radio', // Neonatal Opioid Withdraw/Neonatal Abstinence Syndrome (Updated to radio)
        'group', // Infant’s Medications (Updated to 'group')
      ],
      answers: Array(14).fill(''), // Initialize answers with empty strings
      infantMedications: [
        // Initialize medications with an empty medication
        { medication: '', dose: '', prescriber: '' },
      ],
      provideAdditionalInfo: '', // Added state for skipping
      firstName: '', // Declare firstName state
      lastName: '', // Declare lastName state
      isNICUQuestion: false, // State to track whether NICU question should be displayed
  nicuStayDays: '', // State to store the number of NICU days
    };

    // Options for 'Child's Gender'
    this.childGenderOptions = ['Male', 'Female'];

    // Options for 'NICU Visit?'
    this.nicuVisitOptions = ['No', 'Yes'];

    // Options for 'Infant Urine Drug Screening at Birth'
    this.urineScreeningOptions = ['Negative', 'Not Completed', 'Positive'];

    // Options for 'Meconium Results'
    this.meconiumResultsOptions = ['Negative', 'Not Completed', 'Pending', 'Positive'];

    // Additional options for 'Infant’s Medications'
    this.medicationOptions = ['1', '2', '3', '4', '5']; // You can update this list as needed
  }

  handleNextClick = () => {
    // Move to the next question
    this.setState((prevState) => ({
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
    }));
  };

  handlePreviousClick = () => {
    // Move to the previous question
    this.setState((prevState) => ({
      currentQuestionIndex: prevState.currentQuestionIndex - 1,
    }));
  };



  handleInputChange = (event) => {
    const { currentQuestionIndex, answers } = this.state;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = event.target.value;
  
    // Check if it's the "Child's Full Name" question
    if (currentQuestionIndex === 0) {
      // Separate the input into first and last name
      const [firstName, lastName] = event.target.value.split(' ');
      this.setState({
        answers: newAnswers,
        firstName,
        lastName,
      });
    } else {
      // For other text-type questions, update the answers array
      this.setState({ answers: newAnswers });
    }
  };

  handleRadioChange = (event) => {
    const { currentQuestionIndex, answers } = this.state;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = event.target.value;
  
    if (currentQuestionIndex === 8 && event.target.value === 'Yes') {
      // If "Yes" is selected, show the NICU days question
      this.setState({
        answers: newAnswers,
        isNICUQuestion: true,
      });
    } else {
      // If "No" is selected, hide the NICU days question
      this.setState({
        answers: newAnswers,
        isNICUQuestion: false,
        nicuStayDays: '', // Reset the NICU days
      });
    }
  };
  

  handleGroupInputChange = (event, field, index) => {
    const { infantMedications } = this.state;
    const updatedMedications = [...infantMedications];
    updatedMedications[index][field] = event.target.value;
    this.setState({ infantMedications: updatedMedications });
  };

  handleAddMedication = () => {
    // Add a new empty medication field
    this.setState((prevState) => ({
      infantMedications: [
        ...prevState.infantMedications,
        { medication: '', dose: '', prescriber: '' },
      ],
    }));
  };

  handleRemoveMedication = (index) => {
    // Remove a medication field at the specified index
    this.setState((prevState) => ({
      infantMedications: prevState.infantMedications.filter((_, i) => i !== index),
    }));
  };

  handleEnterClick = () => {
    // Record the data and move to the next question when the Enter button is clicked
    this.handleNextClick();
  };

  render() {
    const {
      currentQuestionIndex,
      questions,
      answerTypes,
      answers,
      infantMedications,
      provideAdditionalInfo,
      firstName,
      lastName,
      isNICUQuestion, // State to track whether NICU question should be displayed
      nicuStayDays, // State to store the number of NICU days
    } = this.state;

    return (
      <div className="maternal-demographics-card">
        <h2>Child Information</h2>
        <div className="question-container">
          {currentQuestionIndex < questions.length ? (
            <>
              <p>{questions[currentQuestionIndex]}</p>
              {answerTypes[currentQuestionIndex] === 'text' ? (
                <>
                  {currentQuestionIndex === 0 ? ( // Check if it's "Child's Full Name" question
                    <>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) =>
                          this.setState({ firstName: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) =>
                          this.setState({ lastName: e.target.value })
                        }
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      value={answers[currentQuestionIndex]}
                      onChange={this.handleInputChange}
                    />
                  )}
                  <div>
                    <button onClick={this.handleEnterClick}>Enter</button>
                    {currentQuestionIndex < questions.length - 1 && (
                      <button onClick={this.handleNextClick}>Next</button>
                    )}
                  </div>
                </>
              ) : answerTypes[currentQuestionIndex] === 'date' ? (
                <>
                  <input
                    type="date"
                    value={answers[currentQuestionIndex]}
                    onChange={this.handleInputChange}
                  />
                  <div>
                    <button onClick={this.handleEnterClick}>Enter</button>
                    {currentQuestionIndex < questions.length - 1 && (
                      <button onClick={this.handleNextClick}>Next</button>
                    )}
                  </div>
                </>
              ) : answerTypes[currentQuestionIndex] === 'radio' ? (
                <div>
                  {currentQuestionIndex === 2 ? (
                    this.childGenderOptions.map((option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          value={option}
                          checked={answers[currentQuestionIndex] === option}
                          onChange={this.handleRadioChange}
                        />
                        {option}
                      </label>
                    ))
                  ) : currentQuestionIndex === 8 ? (
                    <>
                   
                  </>

                  ) : currentQuestionIndex === 9 ? (
                    this.urineScreeningOptions.map((option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          value={option}
                          checked={answers[currentQuestionIndex] === option}
                          onChange={this.handleRadioChange}
                        />
                        {option}
                      </label>
                    ))
                  ) : currentQuestionIndex === 10? (
                    this.meconiumResultsOptions.map((option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          value={option}
                          checked={answers[currentQuestionIndex] === option}
                          onChange={this.handleRadioChange}
                        />
                        {option}
                      </label>
                    ))
                  ) : currentQuestionIndex === 11 ? (
                    <>
                      <label>
                        <input
                          type="radio"
                          value="No"
                          checked={answers[currentQuestionIndex] === 'No'}
                          onChange={this.handleRadioChange}
                        />
                        No
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="Yes"
                          checked={answers[currentQuestionIndex] === 'Yes'}
                          onChange={this.handleRadioChange}
                        />
                        Yes
                      </label>
                    </>
                  ) : null}
                  <div>
                    <button onClick={this.handleEnterClick}>Enter</button>
                    {currentQuestionIndex < questions.length - 1 && (
                      <button onClick={this.handleNextClick}>Next</button>
                    )}
                  </div>
                </div>
              ) : answerTypes[currentQuestionIndex] === 'tel' ? (
                <>
                  <input
                    type="tel"
                    value={answers[currentQuestionIndex]}
                    onChange={this.handleInputChange}
                  />
                  <div>
                    <button onClick={this.handleEnterClick}>Enter</button>
                    {currentQuestionIndex < questions.length - 1 && (
                      <button onClick={this.handleNextClick}>Next</button>
                    )}
                  </div>
                </>
              ) : answerTypes[currentQuestionIndex] === 'group' ? (
                <>
                  {infantMedications.map((medication, index) => (
                    <div key={index} className="medication-field">
                        <label>New Medication {index + 1}:</label>
                      <input
                        type="text"
                        placeholder="Medication"
                        value={medication.medication}
                        onChange={(e) =>
                          this.handleGroupInputChange(e, 'medication', index)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Dose"
                        value={medication.dose}
                        onChange={(e) =>
                          this.handleGroupInputChange(e, 'dose', index)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Prescriber"
                        value={medication.prescriber}
                        onChange={(e) =>
                          this.handleGroupInputChange(e, 'prescriber', index)
                        }
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => this.handleRemoveMedication(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={this.handleAddMedication}>Add Medication</button>
                  <div>
                    <button onClick={this.handleEnterClick}>Enter</button>
                    {currentQuestionIndex < questions.length - 1 && (
                      <button onClick={this.handleNextClick}>Next</button>
                    )}
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <p>Thank you for submitting the form!</p>
          )}
        </div>
      </div>
    );
  }
}

export default ChildInformationCard;

