import React from 'react';

const Relapseplanprofile = () => {
  
  const questions = [
        '3 things  trigger your desire to use:',
        '3 skills or things you enjoy doing that can help get your mind off using:',
        '3 people you can talk to if you are thinking about using:',
        "my safe caregivers 1:",
        "frist name:",
        "Last name:",
        "contact number:",
        "relationship:",
        "my safe caregivers 2:",
        "frist name:",
        "Last name:",
        "contact number:",
        "relationship:",
  ];


  return (
    <div className="service-profile-container">
      <h2>Relapse Plan</h2>
      {questions.map((question, index) => (
        <div key={index} className="question-container">
          <p>{question}</p>
        </div>
      ))}
    </div>
  );
};

export default Relapseplanprofile;