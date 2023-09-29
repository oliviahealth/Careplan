import React, { Component } from 'react';

class MaternalDemographicsCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentQuestionIndex: 0,
      questions: [
        'Name:',
        'Date of Birth:',
        'Current Living Arrangement:',
        'Street Address:',
        'Primary Phone Number:',
        'Phone Number:',
        'Emergency Contact (Name, Phone number, Address):',
        'Marital Status:',
        'Do you have insurance:',
      ],
      answerTypes: [
        'text', // Name
        'date', // Date of Birth (Changed to date input)
        'radio', // Current Living Arrangement
        'text', // Street Address
        'tel', // Updated input type for Primary Phone Number
        'tel', // Updated input type for Phone Number
        'group', // Group for Emergency Contact
        'radio', // Marital Status
        'radio', // Do you have insurance
      ],
      answers: Array(9).fill(''), // Initialize answers with empty strings
      emergencyContact: {
        phone: '',
        address: '',
        name: '',
      },
    };

    // Additional options for 'Current Living Arrangement'
    this.currentLivingArrangementOptions = [
      'Rent/Own a Home',
      'Living with Relatives or Friends',
      'Residential Treatment Center',
      'Correctional Facility',
      'Emergency Shelter',
      'Homeless',
      'Other',
    ];

    // Options for 'Marital Status' and 'Do you have insurance'
    this.maritalStatusOptions = [
      'Single',
      'Married',
      'Divorced',
      'Widowed',
      'Separated',
    ];

    this.insuranceOptions = ['Yes', 'No'];
  }

  handleNextClick = () => {
    // Move to the next question
    this.setState((prevState) => ({
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
    }));
  };

  handleInputChange = (event) => {
    const { currentQuestionIndex, answers } = this.state;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = event.target.value;

    // Update the answers array when the user types
    this.setState({ answers: newAnswers });
  };

  handleRadioChange = (event) => {
    const { currentQuestionIndex, answers } = this.state;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = event.target.value;

    // Update the answers array when the user selects a radio option
    this.setState({ answers: newAnswers });
  };

  handleGroupInputChange = (event, field) => {
    const { emergencyContact } = this.state;
    const updatedEmergencyContact = { ...emergencyContact, [field]: event.target.value };
    this.setState({ emergencyContact: updatedEmergencyContact });
  };

  handleEnterClick = () => {
    // Record the data and move to the next question when the Enter button is clicked
    this.handleNextClick();
  };

  render() {
    const { currentQuestionIndex, questions, answerTypes, answers, emergencyContact } = this.state;

    return (
      <div className="maternal-demographics-card">
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
                    onChange={this.handleInputChange}
                  />
                  <div>
                    <button onClick={this.handleEnterClick}>Enter</button>
                    <button onClick={this.handleNextClick}>Next</button>
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
                    <button onClick={this.handleNextClick}>Next</button>
                  </div>
                </>
              ) : answerTypes[currentQuestionIndex] === 'radio' ? (
                <div>
                  {currentQuestionIndex === 2 ? ( // Check if it's the 'Current Living Arrangement' question
                    this.currentLivingArrangementOptions.map((option) => (
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
                  ) : currentQuestionIndex === 7 ? ( // Check if it's the 'Marital Status' question
                    this.maritalStatusOptions.map((option) => (
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
                  ) : currentQuestionIndex === 8 ? ( // Check if it's the 'Do you have insurance?' question
                    this.insuranceOptions.map((option) => (
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
                  ) : null}
                  <div>
                    <button onClick={this.handleEnterClick}>Enter</button>
                    <button onClick={this.handleNextClick}>Next</button>
                  </div>
                </div>
              ) : answerTypes[currentQuestionIndex] === 'tel' ? (
                <>
                  <input
                    type="tel" // Use 'tel' type for phone number
                    value={answers[currentQuestionIndex]}
                    onChange={this.handleInputChange}
                  />
                  <div>
                    <button onClick={this.handleEnterClick}>Enter</button>
                    <button onClick={this.handleNextClick}>Next</button>
                  </div>
                </>
              ) : answerTypes[currentQuestionIndex] === 'group' ? (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={emergencyContact.name}
                    onChange={(e) => this.handleGroupInputChange(e, 'name')}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={emergencyContact.phone}
                    onChange={(e) => this.handleGroupInputChange(e, 'phone')}
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={emergencyContact.address}
                    onChange={(e) => this.handleGroupInputChange(e, 'address')}
                  />
                  <div>
                    <button onClick={this.handleEnterClick}>Enter</button>
                    <button onClick={this.handleNextClick}>Next</button>
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <p> Thank you!</p>
          )}
        </div>
      </div>
    );
  }
}

export default MaternalDemographicsCard;

