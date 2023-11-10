import React, { Component } from 'react';

class ChildInformationCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // ... (existing state properties)
      isNICUQuestion: false, // State to track whether NICU question should be displayed
      nicuStayDays: '', // State to store the number of NICU days
      NICUanswerr: 'No', // State for NICU answer (default to 'No')
    };

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

 
  
  handlePreviousClick = () => {
    // Move to the previous question
    this.setState((prevState) => ({
      currentQuestionIndex: prevState.currentQuestionIndex - 1,
    }));
  };

  handleNextClick = () => {
    // Move to the next question
    this.setState((prevState) => ({
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
    }));
  };

  handleFinalSubmit = async () => {
    console.log(this.state.answers, this.state.emergencyContact);
    // Assuming you have a function to set form submission state
    this.setFormSubmitted(true);
  };

  handleNICUAnswerChange = (event) => {
    const { value } = event.target;
    // Update the state for NICU answer
    this.setState({
      NICUanswerr: value,
      isNICUQuestion: value === 'Yes', // Show the NICU days question if 'Yes' is selected
      nicuStayDays: value === 'Yes' ? '' : this.state.nicuStayDays, // Reset NICU days if 'No' is selected
    });
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
  
    this.setState({ answers: newAnswers });
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


  render() {
    const {
      currentQuestionIndex,
      questions,
      answerTypes,
      answers,
      infantMedications,
      firstName,
      lastName,
      isNICUQuestion,
      nicuStayDays,
      NICUanswerr,
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
                </>
              ) : answerTypes[currentQuestionIndex] === 'date' ? (
                <>
                  <input
                    type="date"
                    value={answers[currentQuestionIndex]}
                    onChange={this.handleInputChange}
                  />
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
                    <div>
                      <label>
                        <input
                          type="radio"
                          value="Yes"
                          checked={NICUanswerr === 'Yes'}
                          onChange={this.handleNICUAnswerChange}
                        />
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="No"
                          checked={NICUanswerr === 'No'}
                          onChange={this.handleNICUAnswerChange}
                        />
                        No
                      </label>
                      {isNICUQuestion && (
                        <input
                          type="text"
                          placeholder="Number of NICU days"
                          value={nicuStayDays}
                          onChange={(e) =>
                            this.setState({ nicuStayDays: e.target.value })
                          }
                        />
                      )}
                  </div>

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
                </div>
              ) : answerTypes[currentQuestionIndex] === 'tel' ? (
                <>
                  <input
                    type="tel"
                    value={answers[currentQuestionIndex]}
                    onChange={this.handleInputChange}
                  />
                 
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
                </>
              ) : null}
            </>
          ) : (
            <p>Thank you for submitting the form!</p>
          )}
          </div>

{/* Place the navigation/submit buttons here */}
<div>
  {currentQuestionIndex > 0 && (
    <button onClick={this.handlePreviousClick}>Previous</button>
  )}
  {currentQuestionIndex < questions.length - 1 ? (
    <button onClick={this.handleNextClick}>Next</button>
  ) : (
    <button onClick={this.handleFinalSubmit}>Enter</button>
  )}
</div>
</div>
            
   
    );
  }
}

export default ChildInformationCard;

