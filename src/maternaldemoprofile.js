import React from 'react';
import { useAuth } from './AuthContext';

const MaternalDemographicsprofile = () => {
  const { authenticated } = useAuth();
  
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

  if (!authenticated) {
    return <p>You are not authorized to access this page.</p>;
  }

  return (
    <div className="maternal-demographics-card">
      <h2>Maternal Demographics</h2>
      {questions.map((question, index) => (
        <div key={index} className="question-container">
          <p>{question}</p>
        </div>
      ))}
    </div>
  );
};

export default MaternalDemographicsprofile;
