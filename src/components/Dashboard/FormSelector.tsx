import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface FormSelectorProps {
  name: string;
  path: string;
  apiUrl: string;
  userID: string;
  fieldType: string;
}


const FormSelector: React.FC<FormSelectorProps> = ({
  name,
  path,
  apiUrl,
  userID,
  fieldType,
}) => {
  const [formData, setFormData] = useState<Record<string, string | null>>({});
  const [completed, setCompleted] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/${userID}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [apiUrl, userID]);

  useEffect(() => {
    let allFieldsCompleted = true;
    Object.entries(formData).forEach(([_key, value]) => {
      if (value === "" || value === null) {
        allFieldsCompleted = false;
      }
    });
    setCompleted(allFieldsCompleted);
  }, [formData]);

  const fieldNames: {
    maternalDemographics: { [key: string]: string };
    maternalMedicalHistory: { [key: string]: string };
    psychiatricHistory: { [key: string]: string };
    substanceUseHistory: { [key: string]: string };
    drugScreeningResults: { [key: string]: string };
    familyAndSupports: { [key: string]: string };
    infantInformation: { [key: string]: string };
  } = {
    maternalDemographics: {
      name: "Name",
      date_of_birth: "Date of Birth",
      current_living_arrangement: "Current Living Arrangement",
      street_address: "Street Address",
      city: "City",
      state: "State",
      zip_code: "Zip Code",
      county: "County",
      primary_phone_number: "Primary Phone Number",
      phone_type: "Phone Type",
      emergency_contact: "Emergency Contact",
      emergency_contact_phone: "Emergency Contact Phone Number",
      relationship: "Relationship",
      marital_status: "Marital Status",
      insurance_plan: "Insurance Plan",
      effective_date: "Effective Date",
      subscriber_id: "Subscriber ID",
      group_id: "Group ID",
    },
    maternalMedicalHistory: {
      gestational_age: "Gestational Age",
      anticipated_delivery_date: "Anticipated Delivery Date",
      planned_mode_delivery: "Planned Mode of Delivery",
      actual_mode_delivery: "Actual Mode of Delivery",
      attended_postpartum_visit: "Attended Postpartum Visit",
      postpartum_visit_location: "Postpartum Visit Location",
      postpartum_visit_date: "Postpartum Visit Date",
      total_num_pregnancies: "Total Number of Pregnancies",
      total_num_live_births: "Number of Live Births",
      total_num_children_with_mother: "Number of Children Currently Living with Mother",
      prior_complications: "Complications During Prior Pregnancies",
      med_problems_diagnoses: "Medical Problems Requiring Ongoing Care",
      current_medication_list: "Current Medication List",
      notes: "Notes",
      obgyn: "OB/GYN or Primary Care Provider"
    },
    psychiatricHistory: {
      diagnoses: "Diagnoses",
      notes: "Notes",
      obgyn: "OB/GYN"
    },
    substanceUseHistory: {
      alcohol: "Alcohol",
      benzodiazepines: "Benzodiazepines",
      heroin: "Heroin",
      kush: "Kush",
      marijuana: "Marijuana",
      methamphetamine: "Methamphetamine",
      prescription_drugs: "Prescription Drugs",
      tobacco: "Tobacco",
      other1: "Other",
      other2: "Other",
      notes: "Notes",
      treatment_case_manager: "Treatment Case Manager"
    },
    drugScreeningResults: {
      tests: "Tests",
      provider_ordering_UDS: "Provider Ordering UDS"
    },
    familyAndSupports: {
      people_living_in_home: "List of People Living in the Home",
      clients_children_not_living_in_home: "List of Clients Children NOT Living in the Home",
      notes: "Notes",
      current_support_system: "Current Support System",
      strength_of_client_and_support_system: "Strengths of Client and Support System",
      goals: "Goals",
      recovery_coach: "Recovery Coach"
    },
    infantInformation: {
      child_name: "Child's Name",
      date_of_birth: "Date of Birth",
      sex: "Sex",
      birth_weight: "Birth Weight",
      gestational_age_at_birth: "Gestational Age at Birth",
      NICU_stay: "NICU",
      NICU_length_of_stay: "NICU Length of Stay",
      pediatrician_name: "Pediatrician Name",
      pediatrician_contact_info: "Pediatrician Contact Number",
      infant_urine_drug_screening_at_birth: "Infant Urine Drug Screening at Birth",
      infant_urine_drug_screening_at_birth_specify: "Specify Infant Urine Drug Screening at Birth",
      meconium_results: "Meconium Results",
      meconium_results_specify: "Specify Meconium Results",
      neonatal_opiod_withdraw: "Neonatal Opiod Withdraw",
      neonatal_opiod_withdraw_treatment_method: "Neonatal Opiod Withdraw Treatment Method",
      DX_problems_additional_information: "DX/Problems and Additional Information",
      infant_care_needs_items: "Infant Care Needs",
      where_will_baby_sleep: "Where Will Baby Sleep",
      infant_care_needs_additional_notes: "Infant Care Needs Additional Notes",
      infant_medications: "Infant Medications",
      infant_medication_notes: "Infant Medications Notes",
      father_name: "Father's Name",
      father_date_of_birth: "Father's DOB",
      father_street_address: "Father's Street Address",
      father_city: "Father's City",
      father_state: "Father's State",
      father_zip_code: "Father's Zip Code",
      father_primary_phone_numbers: "Father's Primary Phone Numbers",
      father_involved_in_babys_life: "Father Involved in Baby's Life",
      father_involved_in_babys_life_comments: "Father Involved in Baby's Life Comments",
      father_notes: "Father Notes"
    }
  }

  const ShowMedicationList = (data: any) => {
    return data.map((x: any) => {
      return (
        <div>
          <div> Name: {x.name} </div>
          <div> Dose: {x.dose} </div>
          <div> Prescriber: {x.prescriber} </div>
          <div> Notes: {x.notes} </div>
        </div>
      )
    })
  }

  const pscyhiatricHistoryDiagnoses = (data: any) => {
    return data.map((x: any) => {
      return (
        <div>
          <div> Provider: {x.provider} </div>
          <div> Phone Number: {x.phone_number} </div>
          <div> Diagnosis: {x.diagnosis} </div>
          <div> Date of Diagnosis: {x.date_of_diagnosis} </div>
          <div> Currently taking medication: {x.taking_medication} </div>
        </div>
      )
    })
  }

  const substanceUseHistoryDrugs = (formData: any) => {
    return (
      <div>
        {Object.keys(formData).map((drug, index) => (
          <div key={index}>
            <div>{drug}: {formData[drug]}</div>
          </div>
        ))}
      </div>
    );
  };

  const drugScreeningResultsTests = (data: any) => {
    return data.map((x: any) => {
      return (
        <div>
          <div> Test: {x.test_ordered} </div>
          <div> Date of Test: {x.date_collected} </div>
          <div> Provider name: {x.provider} </div>
          <div> Provider Location: {x.provider_location} </div>
          <div> Test Results: {x.results} </div>
          <div> Test Results Specification: {x.specify_results} </div>
          <div> Reviewed with Provider: {x.provider_reviewed} </div>
          <div> Date Reviewed: {x.date_reviewed} </div>
        </div>
      )
    })
  }

  const familyAndSupportsPeopleInHome = (data: any) => {
    return data.map((x: any) => {
      return (
        <div>
          <div> Person: {x.person} </div>
          <div> Date of Birth: {x.date_of_birth} </div>
          <div> Relation: {x.relation} </div>
        </div>
      )
    })
  }

  const familyAndSupportsChildrenNotHome = (data: any) => {
    return data.map((x: any) => {
      return (
        <div>
          <div> Person: {x.person} </div>
          <div> Date of Birth: {x.date_of_birth} </div>
          <div> Caregiver: {x.caregiver} </div>
          <div> Caregiver Contact Number: {x.caregiver_number} </div>
        </div>
      )
    })
  }

  const familyAndSupportsArrays = (data: any) => {
    return (
      <div>
        {Object.keys(data).map((item, index) => (
          <span key={index}>
            {data[item]}{index === Object.keys(data).length - 1 ? "" : ", "}
          </span>
        ))}
      </div>
    );
  };

  const infantInformationInfantCareNeeds = (formData: any) => {

    const namesMap: { [key: string]: string } = {
      breast_pump: "Breast Pump",
      breastfeeding_support: "Breastfeeding Support",
      car_seat: "Car Seat",
      childcare: "Childcare",
      clothing: "Clothing",
      crib: "Crib",
      diapers: "Diapers",
      infant_formula: "Infant Formula",
      infant_stroller: "Infant Stroller",
      other: "Other"
    };
  
    return (
      <div>
        {Object.keys(formData).map((item, index) => (
          <div key={index}>
            <div>{namesMap[item] || item}: {formData[item]}</div>
          </div>
        ))}
      </div>
    );
  };

  const infantInformationMedications = (data: any) => {
    return data.map((x: any) => {
      return (
        <div>
          <div> Medication: {x.medication} </div>
          <div> Dose: {x.dose} </div>
          <div> Prescriber: {x.prescriber} </div>
          <div> Notes: {x.notes} </div>
        </div>
      )
    })
  }

  const renderFields = (fields: { [key: string]: string }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 py-4 text-sm">
        {Object.entries<string>(fields)
          .map(([key, fieldName]) => (
            <React.Fragment key={key}>
              <div className="flex flex-row gap-1">
                <div className="font-semibold">{fieldName}:</div>
                {key === 'current_medication_list' ? (
                  ShowMedicationList((formData as any)?.[key] || [])
                ) : key === 'diagnoses' ? (
                  pscyhiatricHistoryDiagnoses((formData as any)?.[key] || [])
                ) : key === 'alcohol' || key === 'benzodiazepines' || key === 'heroin' || key === 'kush' || key === 'marijuana' || key === 'methamphetamine' || key === 'prescription_drugs' || key === 'tobacco' || key === 'other1' || key === 'other2' ? (
                  substanceUseHistoryDrugs((formData as any)?.[key] || [])
                ) : key === 'tests' ? (
                  drugScreeningResultsTests((formData as any)?.[key] || [])
                ) : key === 'people_living_in_home' ? (
                  familyAndSupportsPeopleInHome((formData as any)?.[key] || [])
                ) : key === 'clients_children_not_living_in_home' ? (
                  familyAndSupportsChildrenNotHome((formData as any)?.[key] || [])
                ) : key === 'current_support_system' || key === 'strength_of_client_and_support_system' || key === 'goals' ? (
                  familyAndSupportsArrays((formData as any)?.[key] || [])
                ) : key === 'infant_care_needs_items' ? (
                  infantInformationInfantCareNeeds((formData as any)?.[key] || [])
                ) : key === 'infant_medications' ? (
                  infantInformationMedications((formData as any)?.[key] || [])
                ) :
                  (
                    <div>{(formData as any)?.[key]}</div>
                  )}
              </div>
            </React.Fragment>
          ))}
      </div>
    );
  };

  return (
    <div className="collapse collapse-arrow" onClick={fetchData}>
      <input type="checkbox" className="peer" />
      <div className="collapse-title rounded-2xl items-center flex bg-gray-200 justify-between">
        {name}
        <div className="flex flex-row text-red-500">
          {!completed && (
            <>
              <img className="w-4 mr-2" src={`./images/action.svg`} />
              Actions Required
            </>
          )}
        </div>
      </div>
      <div className="collapse-content mt-2 flex flex-col bg-white">
        {fieldType === 'maternalDemographics' && formData && renderFields(fieldNames.maternalDemographics)}
        {fieldType === 'maternalMedicalHistory' && formData && renderFields(fieldNames.maternalMedicalHistory)}
        {fieldType === 'psychiatricHistory' && formData && renderFields(fieldNames.psychiatricHistory)}
        {fieldType === 'substanceUseHistory' && formData && renderFields(fieldNames.substanceUseHistory)}
        {fieldType === 'drugScreeningResults' && formData && renderFields(fieldNames.drugScreeningResults)}
        {fieldType === 'familyAndSupports' && formData && renderFields(fieldNames.familyAndSupports)}
        {fieldType === 'infantInformation' && formData && renderFields(fieldNames.infantInformation)}
        <div className="flex justify-end">
          <Link to={path} className="button-filled font-semibold">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FormSelector;
