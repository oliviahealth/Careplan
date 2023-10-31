import React, { Component } from 'react';

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
        };
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

    render() {
        const { currentQuestionIndex, questions, answers } = this.state;
        const currentQuestion = questions[currentQuestionIndex];
        const options = ['Needed', 'Referred', 'Participating', 'Completed'];

        return (
            <div className="maternal-demographics-card">
                <h2>Service Needs</h2>
                <div className="question-container">
                    <p>{currentQuestion}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {options.map((option, index) => (
                            <div key={index} style={{ marginRight: '10px' }}>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="response"
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
                    <button  onClick={this.handlePrevClick}>Previous</button>
                    <button  onClick={this.handleNextClick}>Next</button>
                </div>
            </div>
        );
    }
}

export default ServicesCard;
