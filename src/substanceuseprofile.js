import React from 'react';
import { useAuth } from './AuthContext';

const Substanceuseprofile = () => {
  const { authenticated } = useAuth();
  
  const questions = [
    'Medication Assisted Treatment (MAT) Engaged:',
    'Date of Last use:',
    'Medication(s) and Dose:',
    'Addiction Medicine Services:',
    'Date of Last Appointment:',
    'Name and Contact Information for MAT Clinic:',
    'Name and Contact Information for Addiction Medicine Clinic:',
  ];

  if (!authenticated) {
    return <p>You are not authorized to access this page.</p>;
  }

  return (
    <div className="maternal-demographics-card">
      <h2>Substance use</h2>
      {questions.map((question, index) => (
        <div key={index} className="question-container">
          <p>{question}</p>
        </div>
      ))}
    </div>
  );
};

export default Substanceuseprofile;
