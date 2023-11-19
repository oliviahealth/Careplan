import React, { Component } from 'react';

const ServiceQuestion = ({ question, organizationName, organizationContact }) => {
    return (
        <div className="question-container">
            <p>{question}</p>
            <div className="organization-info">
                <p>Organization Name: {organizationName}</p>
            </div>
            <div className="organization-info">
                <p>Organization Contact: {organizationContact}</p>
            </div>
        </div>
    );
};

class ServicesProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organizations: [
                // Add organization names and contacts here corresponding to each question
                // For instance:
            ],
        };
    }

    render() {
        const serviceQuestions = [
            "Parenting Classes:",
            "Transportation Services:",
            "SSI/Disability:",
            "Temporary Assistance for Needy Families (TANF):",
            "Personal Safety:",
            "Home Visitation Program:",
            "Housing Assistance:",
            "Healthy Start Program:",
            "CHIP:",
        
            // FOOD/NUTRITION
            "Breastfeeding Support:",
            "Local Food Pantries:",
            "SNAP:",
            "Women, Infants, & Children (WIC):",
        
            // HEALTHCARE
            "Health Insurance Enrollment:",
            "Prenatal Healthcare:",
            "Family Planning:",
            "Primary Care:",
            "Mental Health/Counseling:",
            "Smoking Cessation:",
        
            // SUBSTANCE USE TREATMENT
            "Residential:",
            "Outpatient:",
            "Caring for Two Program:",
            "The Cradles Program:",
            "Recovery Support Services:",
            "Medication-Assisted Treatment (MAT):",
        
            // CHILD RELATED
            "Early Childhood Intervention (ECI):",
            "Early Head Start:",
            "NCI/Childcare Subsidy:",
            "Pediatrician/Primary Care:",
            "Safe Sleep Education:",
        
            // LEGAL ASSISTANCE
            "Child Protective Service:",
            "Legal Aid:",
            "Specialty Court:",
        ];

        const { organizations } = this.state;

        return (
            <div className="service-profile-container">
                <h2>Service Needs Profile</h2>

                    {serviceQuestions.map((question, index) => (
                        <ServiceQuestion
                            key={index}
                            question={question}
                            organizationName={organizations[index]?.name}
                            organizationContact={organizations[index]?.contact}
                        />
                    ))}
                </div>
        );
    }
}

export default ServicesProfile;
