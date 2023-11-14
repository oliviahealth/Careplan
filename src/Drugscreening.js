import React, { useState } from 'react';
import { useAuth } from './AuthContext';
const DrugScreeningResult = () => {
  const { authenticated } = useAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [results, setResults] = useState([
    {
      dateCollected: '',
      orderedBy: '',
      result: 'Negative',
      providerReviewed: 'No',
      specifyResult: '',
    },
  ]);

  const handleAddResult = () => {
    setResults([...results, { dateCollected: '', orderedBy: '', result: 'Negative', providerReviewed: 'No', specifyResult: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedResults = [...results];
    updatedResults[index][field] = value;
    setResults(updatedResults);
  };

  const handleFinalSubmit = async () => {
    // Prepare the data to be sent to the backend
    setFormSubmitted(true);
    const formData = {
      results: results,
      // Add any other data you want to send
    };

    try {
      // Send a POST request to the backend
      const response = await fetch('/api/plan-of-safe-care/drug-screening-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if the request was successful
      if (response.ok) {
        console.log('Data sent successfully!');
        setFormSubmitted(true); // Mark the form as submitted
      } else {
        console.error('Failed to send data to the backend:', await response.text());
      }
    } catch (error) {
      console.error('An error occurred while sending data to the backend:', error);
    }
  };

  return (
    <div className="maternal-demographics-card">
      {authenticated ? (
        <>
          <h2>Drug Screening Results</h2>
          {formSubmitted ? (
            <p>Thank you for submitting the form!</p>
          ) : (
            <div className="question-container">
              {results.map((result, index) => (
                <div key={index}>
                  <p>Result {index + 1}</p>
                  <label>Date Collected:</label>
                  <input
                    type="date"
                    value={result.dateCollected}
                    onChange={(e) => handleInputChange(index, 'dateCollected', e.target.value)}
                  />
                  <label>Ordered by (Provider and Location):</label>
                  <input
                    type="text"
                    value={result.orderedBy}
                    onChange={(e) => handleInputChange(index, 'orderedBy', e.target.value)}
                  />
                  <label>Results:</label>
                  <select
                    value={result.result}
                    onChange={(e) => handleInputChange(index, 'result', e.target.value)}
                  >
                    <option value="Negative">Negative</option>
                    <option value="Positive">Positive</option>
                  </select>
                  {result.result === 'Positive' && (
                    <div>
                      <label>Specify Results:</label>
                      <input
                        type="text"
                        value={result.specifyResult}
                        onChange={(e) => handleInputChange(index, 'specifyResult', e.target.value)}
                      />
                    </div>
                  )}
                  <label>Provider Reviewed with you:</label>
                  <select
                    value={result.providerReviewed}
                    onChange={(e) => handleInputChange(index, 'providerReviewed', e.target.value)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              ))}
              <button onClick={handleAddResult}>Add</button>
              <button onClick={handleFinalSubmit}>Enter</button>
            </div>
          )}
        </>
      ) : (
        <p>You are not authorized to access this page.</p>
      )}
    </div>
  );
};

export default DrugScreeningResult;
