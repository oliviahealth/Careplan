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
    referralsAndServices: { [key: string]: string };
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
    },
    referralsAndServices: {
      parenting_classes: "Parenting Classes",
      transportation_services: "Transportation Services",
      ssi_disability: "SSI Disability",
      temporary_assistance_for_needy_families: "Temporary Assistance for Needy Families",
      personal_safety: "Personal Safety",
      home_visitation_program: "Home Visitation Program",
      housing_assistance: "Housing Assistance",
      healthy_start_program: "Healthy Start Program",
      support_services_other1: "Support Services Other 1",
      support_services_other2: "Support Services Other 2",
      breastfeeding_support: "Breastfeeding Support",
      local_food_pantries: "Local Food Pantries",
      snap: "SNAP",
      women_infants_children: "Women, Infants, and Children",
      food_nutrition_other1: "Food Nutrition Other 1",
      food_nutrition_other2: "Food Nutrition Other 2",
      health_insurance_enrollment: "Health Insurance Enrollment",
      prenatal_healthcare: "Prenatal Healthcare",
      family_planning: "Family Planning",
      primary_care: "Primary Care",
      mental_health_counseling: "Mental Health Counseling",
      smoking_cessation: "Smoking Cessation",
      healthcare_other1: "Healthcare Other 1",
      healthcare_other2: "Healthcare Other 2",
      residential: "Residential",
      outpatient: "Outpatient",
      caring_for_two_program: "Caring for Two Program",
      the_cradles_program: "The Cradles Program",
      recovery_support_services: "Recovery Support Services",
      medication_assisted_treatment: "Medication Assisted Treatment",
      substance_use_treatment_other1: "Substance Use Treatment Other 1",
      substance_use_treatment_other2: "Substance Use Treatment Other 2",
      early_childhood_intervention: "Early Childhood Intervention",
      early_head_start: "Early Head Start",
      NCI_childcare_subsidy: "NCI Childcare Subsidy",
      pediatrician_primary_care: "Pediatrician Primary Care",
      safe_sleep_education: "Safe Sleep Education",
      child_related_other1: "Child Related Other 1",
      child_related_other2: "Child Related Other 2",
      child_protective_service: "Child Protective Service",
      legal_aid: "Legal Aid",
      specialty_court: "Specialty Court",
      legal_assistance_other1: "Legal Assistance Other 1",
      legal_assistance_other2: "Legal Assistance Other 2",
      additional_notes: "Additional Notes"
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

  const substanceUseHistoryDrugs = (data: any) => {

    const namesMap: { [key: string]: string } = {
      ever_used: "Ever Used",
      date_last_used: "Date Last Used",
      notes: "Notes",
      used_during_pregnancy: "Used During Pregnancy"
    };

    return (
      <div>
        {Object.keys(data).map((item, index) => (
          <div key={index}>
            <div>{namesMap[item] || item}: {data[item]}</div>
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

  const infantInformationInfantCareNeeds = (data: any) => {

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
        {Object.keys(data).map((item, index) => (
          <div key={index}>
            <div>{namesMap[item] || item}: {data[item]}</div>
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

  const FamilyAndSupportsServices = (data: any) => {
    const namesMap: { [key: string]: string } = {
      status: "Status",
      organization: "Organization",
      organization_contact_information: "Organization Contact Info"
    };
  
    return (
      <div>
        {Object.keys(data).map((item, index) => (
          <div key={index}>
            <div>{namesMap[item] || item}: {data[item]}</div>
          </div>
        ))}
      </div>
    );
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
                ) : fieldNames.substanceUseHistory[key] && key !== 'notes' && key !== 'treatment_case_manager' ? (
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
                ) : fieldNames.referralsAndServices[key] && key !== 'additional_notes' && key !== 'recovery_coach' ? (
                  FamilyAndSupportsServices((formData as any)?.[key] || [])
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
        {fieldType === 'referralsAndServices' && formData && renderFields(fieldNames.referralsAndServices)}
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
