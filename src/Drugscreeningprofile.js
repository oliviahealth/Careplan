import React from 'react';
import { useAuth } from './AuthContext';

const Drugscreeningprofile = () => {
  const { authenticated } = useAuth();
  
  const questions = [
    'DateCollected:',
    'Ordered by:',
    'Result:',
    'ProviderReviewed:',
    'Specify Results:',
  ];

  if (!authenticated) {
    return <p>You are not authorized to access this page.</p>;
  }

  return (
    <div className="maternal-demographics-card">
      <h2>Drug screening Result</h2>
      {questions.map((question, index) => (
        <div key={index} className="question-container">
          <p>{question}</p>
        </div>
      ))}
    </div>
  );
};

export default Drugscreeningprofile;