import React, { Component } from 'react';
import ProgressNavBar from './ProgressNavBar';

class ServicesCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentQuestionIndex: 0,
            answers: Array(35).fill(null),
            questions: [
                 // SUPPORT SERVICES
           "Parenting Classes",
           "Transportation Services",
           "SSI/Disability",
           "Temporary Assistance for Needy Families (TANF)",
           "Personal Safety",
           "Home Visitation Program",
           "Housing Assistance",
           "Healthy Start Program",
           "CHIP",
   
           // FOOD/NUTRITION
           "Breastfeeding Support",
           "Local Food Pantries",
           "SNAP",
           "Women, Infants, & Children (WIC)",
   
           // HEALTHCARE
           "Health Insurance Enrollment",
           "Prenatal Healthcare",
           "Family Planning",
           "Primary Care",
           "Mental Health/Counseling",
           "Smoking Cessation",
   
           // SUBSTANCE USE TREATMENT
           "Residential",
           "Outpatient",
           "Caring for Two Program",
           "The Cradles Program",
           "Recovery Support Services",
           "Medication-Assisted Treatment (MAT)",
   
           // CHILD RELATED
           "Early Childhood Intervention (ECI)",
           "Early Head Start",
           "NCI/Childcare Subsidy",
           "Pediatrician/Primary Care",
           "Safe Sleep Education",
   
           // LEGAL ASSISTANCE
           "Child Protective Service",
           "Legal Aid",
           "Specialty Court"
           // Add more questions as needed
            ],
            categories: {
                0: 'SUPPORT SERVICES',
                9: 'FOOD/NUTRITION',
                13: 'HEALTHCARE',
                19: 'SUBSTANCE USE TREATMENT',
                25: 'CHILD RELATED',
                30: 'LEGAL ASSISTANCE',
                // Add more categories as needed
            },
        };
    }
   
    getCategoryLabel(index) {
        const { categories } = this.state;
        let categoryLabel = '';
        for (const [key, value] of Object.entries(categories).sort((a, b) => a[0] - b[0])) {
            if (index >= key) {
                categoryLabel = value;
            } else {
                break;
            }
        }
        return categoryLabel;
    }

    handleNextClick = () => {
        const nextIndex = this.state.currentQuestionIndex + 1;
        if (nextIndex < this.state.questions.length) {
            this.setState({ currentQuestionIndex: nextIndex });
        } else {
            console.log('All questions completed!');
        }
    };

    handlePrevClick = () => {
        const prevIndex = this.state.currentQuestionIndex - 1;
        if (prevIndex >= 0) {
            this.setState({ currentQuestionIndex: prevIndex });
        }
    };

    handleOptionChange = (changeEvent) => {
        const updatedAnswers = [...this.state.answers];
        updatedAnswers[this.state.currentQuestionIndex] = changeEvent.target.value;
        this.setState({ answers: updatedAnswers });
    };

    navigateToQuestion = (index) => {
        this.setState({ currentQuestionIndex: index });
    };

    render() {
        const { currentQuestionIndex, questions, answers } = this.state;
        const currentQuestion = questions[currentQuestionIndex];
        const categoryLabel = this.getCategoryLabel(currentQuestionIndex);
        const options = ['Needed', 'Referred', 'Participating', 'Completed'];
        const isLastQuestion = currentQuestionIndex === questions.length - 1;

        return (
            <div className="maternal-demographics-card">
                 <ProgressNavBar 
                  totalQuestions={questions.length}
                  currentQuestionIndex={currentQuestionIndex}
                  onNavigate={this.navigateToQuestion}
                />
                <h2>Service Needs</h2>
                {/* Display category label for all questions within the category */}
                <h3>{categoryLabel}</h3>
                <div className="question-container">
                    <p>{currentQuestion}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {options.map((option, index) => (
                            <div key={index} style={{ marginRight: '10px' }}>
                                <label>
                                    <input 
                                        type="radio" 
                                        name={`response_${currentQuestionIndex}`}
                                        value={option}
                                        checked={answers[currentQuestionIndex] === option}
                                        onChange={this.handleOptionChange} 
                                    />
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="info-inputs" style={{ marginTop: '10px' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Organization Name: </label>
                            <input type="text" placeholder="Enter Organization Name" />
                        </div>
                        <div>
                            <label>Organization Contact Information: </label>
                            <input type="text" placeholder="Enter Contact Information" />
                        </div>
                    </div>
                </div>
                <div>
                    <button onClick={this.handlePrevClick}>Previous</button>
                    <button onClick={this.handleNextClick}>Next</button>
                    
                </div>
                <div className="question-number-indicator">
                     Question {currentQuestionIndex + 1}
                 </div>
            </div>
        );
    }
}

export default ServicesCard;