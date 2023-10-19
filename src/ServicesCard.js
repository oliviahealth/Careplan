import React, { Component } from 'react';

class ServicesCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSectionIndex: 0,
      sections: [
        {
          label: 'SUPPORT SERVICES',
          questions: [
            'Parenting Classes',
            'Transportation Services',
            'SSI/Disability',
            'Temporary Assistance for Needy Families (TANF)',
            'Personal Safety',
            'Home Visitation Program',
            'Housing Assistance',
            'Healthy Start Program',
            'CHIP',
            'Other',
            'Other',
          ],
        },
        {
          label: 'FOOD/NUTRITION',
          questions: [
            'Breastfeeding Support',
            'Local Food Pantries',
            'SNAP',
            'Women, Infants, & Children (WIC)',
            'Other',
            'Other',
          ],
        },
        // Add more sections here
        {
            label: 'HEALTHCARE',
            questions: [
              'Health Insurance Enrollment',
              'Prenatal Healthcare',
              'Family Planning',
              'Primary Care',
              'Mental Health/Counseling',
              'Smoking Cessation',
              'Other',
              'Other',
            ],
          },
          {
            label: 'SUBSTANCE USE TREATMENT',
            questions: [
              'Residential',
              'Outpatient',
              'Caring for Two Program',
              'The Cradles Program',
              'Recovery Support Services',
              'Medication-Assisted Treatment (MAT)',
              'Other',
              'Other',
            ],
          },
          {
            label: 'CHILD RELATED',
            questions: [
              'Early Childhood Intervention (ECI)',
              'Early Head Start',
              'NCI/Childcare Subsidy',
              'Pediatrician/Primary Care',
              'Safe Sleep Education',
              'Other',
              'Other',
            ],
          },
          {
            label: 'LEGAL ASSISTANCE',
            questions: [
              'Child Protective Service',
              'Legal Aid',
              'Specialty Court ( )',
              'Other',
              'Other',
            ],
          },          
      ],
      services: [], // Array to store the selected services
    };
  }

  handleNextClick = () => {
    const { currentSectionIndex, sections } = this.state;
    if (currentSectionIndex < sections.length - 1) {
      this.setState({ currentSectionIndex: currentSectionIndex + 1 });
    }
  };

  handleServiceSelection = (service) => {
    const { services, currentSectionIndex } = this.state;
    const updatedServices = [...services];
    updatedServices[currentSectionIndex] = service;
    this.setState({ services: updatedServices });
  };

  render() {
    const { currentSectionIndex, sections, services } = this.state;
    const currentSection = sections[currentSectionIndex];

    return (
      <div className="service-program-card">
        <h2>Service/Program Card</h2>
        {currentSection && (
          <>
            <h3>{currentSection.label}</h3>
            <table>
              <thead>
                <tr>
                  <th>Service/Program</th>
                  <th>Discussed</th>
                  <th>Needed</th>
                  <th>Referred</th>
                  <th>Participating</th>
                  <th>Completed</th>
                  <th>Organization</th>
                  <th>Organization Contact Information</th>
                </tr>
              </thead>
              <tbody>
                {currentSection.questions.map((question, index) => (
                  <tr key={index}>
                    <td>{question}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={services[currentSectionIndex] === question}
                        onChange={() => this.handleServiceSelection(question)}
                      />
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <textarea rows="2" />
                    </td>
                    <td>
                      <textarea rows="2" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {currentSectionIndex < sections.length - 1 && (
          <button onClick={this.handleNextClick}>Next</button>
        )}
      </div>
    );
  }
}

export default ServicesCard;