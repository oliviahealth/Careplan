import React from 'react';
import { useAuth } from './AuthContext';

const SocialSupportProfile = () => {
  const { authenticated } = useAuth();
  
  const questions = [
    'First Name:',
    'Last Name:', 
    'Date of Birth:',
    'Relationship',
    'Goals:',
    'Support:',
    'Feelings about Relationships:',
  ];

  if (!authenticated) {
    return <p>You are not authorized to access this page.</p>;
  }

  return (
    <div className="service-profile-container">
      <h2>Social Support Profile</h2>
      {questions.map((question, index) => (
        <div key={index} className="question-container">
          <p>{question}</p>
        </div>
      ))}
    </div>
  );
};

export default SocialSupportProfile;
