import React, { Component } from 'react';

class RelapsePlanCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentQuestionIndex: 0,
      questions: [
        'List 3 things that you know trigger your desire to use:',
        'List 3 skills or things you enjoy doing that can help get your mind off using:',
        'List 3 people you can talk to if you are thinking about using:',
        'In the case I relapse, my safe caregivers will be:',
      ],
      answerTypes: [
        'list', // List of triggers
        'list', // Skills or things to get mind off using
        'list', // List of people to talk to
        'group', // Safe caregivers
      ],
      listAnswers: ['', '', ''], // Initialize list answers with empty strings
      safeCaregivers: [
        {
          name: '',
          contactNumber: '',
          relationship: '',
        },
        {
          name: '',
          contactNumber: '',
          relationship: '',
        },
      ],
    };
  }

  handleNextClick = () => {
    // Move to the next question
    this.setState((prevState) => ({
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
    }));
  };

  handleInputChange = (event) => {
    const { currentQuestionIndex, listAnswers } = this.state;
    const newAnswers = [...listAnswers];
    newAnswers[currentQuestionIndex] = event.target.value;

    // Update the listAnswers array when the user types
    this.setState({ listAnswers: newAnswers });
  };

  handleGroupInputChange = (event, index, field) => {
    const { safeCaregivers } = this.state;
    const updatedSafeCaregivers = [...safeCaregivers];
    updatedSafeCaregivers[index][field] = event.target.value;
    this.setState({ safeCaregivers: updatedSafeCaregivers });
  };

  handleEnterClick = () => {
    // Record the data and move to the next question when the Enter button is clicked
    this.handleNextClick();
  };

  render() {
    const { currentQuestionIndex, questions, answerTypes, listAnswers, safeCaregivers } = this.state;

    return (
      <div className="maternal-demographics-card">
        <h2>Relapse Plan</h2>
        <div className="question-container">
          {currentQuestionIndex < questions.length ? (
            <>
              <p>{questions[currentQuestionIndex]}</p>
              {answerTypes[currentQuestionIndex] === 'list' ? (
                <>
                  {[0, 1, 2].map((index) => (
                    <div key={index}>
                      <input
                        type="text"
                        placeholder={`Item ${index + 1}`}
                        value={listAnswers[index]}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  ))}
                  <div>
                    <button onClick={this.handleEnterClick}>Enter</button>
                    <button onClick={this.handleNextClick}>Next</button>
                  </div>
                </>
              ) : answerTypes[currentQuestionIndex] === 'group' ? (
                <>
                  {safeCaregivers.map((caregiver, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        placeholder={`Safe Caregiver ${index + 1} Name`}
                        value={caregiver.name}
                        onChange={(e) => this.handleGroupInputChange(e, index, 'name')}
                      />
                      <input
                        type="tel"
                        placeholder={`Contact Number ${index + 1}`}
                        value={caregiver.contactNumber}
                        onChange={(e) => this.handleGroupInputChange(e, index, 'contactNumber')}
                      />
                      <input
                        type="text"
                        placeholder={`Relationship to You ${index + 1}`}
                        value={caregiver.relationship}
                        onChange={(e) => this.handleGroupInputChange(e, index, 'relationship')}
                      />
                    </div>
                  ))}
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

export default RelapsePlanCard;
