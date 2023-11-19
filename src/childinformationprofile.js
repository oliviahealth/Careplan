import React from 'react';
import { useAuth } from './AuthContext';

const ChildInformationProfile = () => {
  const { authenticated } = useAuth();

  const questions = [
    "Child's Full Name:",
    "Child's Date of Birth:",
    "Child's Gender:", 
    "Child's Relationship to You:",
    "Child's medical conditions:",
    "Child's Doctor's Name:",
    "Doctor's Phone Number:", 
    "Date of Last Doctor Visit:",
    "Did your infant stay at the Neonatal Intensive Care Unit (NICU)?:", // Updated NICU Visit question
    'Infant Urine Drug Screening at Birth:', // Updated Infant Urine Drug Screening at Birth
    'Meconium Results:', 
    'Neonatal Opioid Withdraw/Neonatal Abstinence Syndrome:', 
    "Infant’s Medications:",
  ];

  if (!authenticated) {
    return <p>You are not authorized to access this page.</p>;
  }

  return (
    <div className="service-profile-container">
      <h2>Child Information</h2>
      {questions.map((question, index) => (
        <div key={index} className="question-container">
          <p>{question}</p>
        </div>
      ))}
    </div>
  );
};

export default ChildInformationProfile;
