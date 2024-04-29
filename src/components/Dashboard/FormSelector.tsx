import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Accordion from "../Accordion";

interface FormSelectorProps {
  name: string;
  path: string;
  apiUrl: string;
  userID: string;
}

const FormSelector: React.FC<FormSelectorProps> = ({
  name,
  path,
  apiUrl,
  userID,
}) => {
  const [formData, setFormData] = useState<Record<string, string | null>>({});
  const [completed, setCompleted] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmissionID, setSelectedSubmissionID] = useState<string | null>(null);
  const [submissionsFetched, setSubmissionsFetched] = useState<boolean>(false);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/get_${apiUrl}/${userID}`
      );
      const allSubmissions = response.data;
      setSubmissions(allSubmissions);

      if (allSubmissions.length > 0) {
        setFormData(allSubmissions[allSubmissions.length - 1]);
        setSelectedSubmissionID(allSubmissions[allSubmissions.length - 1].id);
      }
      setSubmissionsFetched(true);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
    setIsLoading(false);
  };

  const handleSubmissionClick = async (submissionID: string) => {
    const selectedSubmission = submissions.find(submission => submission.id === submissionID);
    if (selectedSubmission) {
      setFormData(selectedSubmission);
      setSelectedSubmissionID(submissionID);
    }
  };

  const handleDeleteSubmission = async (submissionID: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this submission?"
    );

    if (confirmed) {
      try {
        await axios.delete(
          `http://127.0.0.1:5000/api/delete_${apiUrl}/${submissionID}`
        );
        fetchSubmissions();
        setFormData({});
      } catch (error) {
        console.error("Error deleting submission:", error);
      }
    }
  };

  const renderSubmissions = () => {

    const sortedSubmissions = [...submissions].sort((a: any, b: any) => {
      a = new Date(a.timestamp);
      b = new Date(b.timestamp)
      return a.getTime() - b.getTime();
    });

    return (
      <div className="relative flex">
        <select
          value={selectedSubmissionID || ""}
          onChange={(e) => handleSubmissionClick(e.target.value)}
          className="block bg-white border border-neutral-300 hover:border-neutral-400 mr-2 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {sortedSubmissions.map((submission: any) => (
            <option key={submission.id} value={submission.id}>
              Submission{" "}
              {new Date(submission.timestamp).toLocaleString("en-US", {
                timeZone: "America/Chicago",
              })}{" "}
              CST
            </option>
          ))}
        </select>
        {selectedSubmissionID && (
          <>
            <Link to={`${path}/${selectedSubmissionID}`} className="button-filled font-semibold">
              Edit
            </Link>
            <button
              onClick={() => handleDeleteSubmission(selectedSubmissionID)}
              className="border border-neutral-300 hover:border-neutral-400 rounded-lg shadow-sm px-2 py-2 text-white bg-red-700 hover:bg-red-800"
            >
              Delete
            </button>
          </>
        )}
      </div>
    );
  };

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
    medicalServicesForSubstanceUse: { [key: string]: string };
    substanceUseHistory: { [key: string]: string };
    drugScreeningResults: { [key: string]: string };
    familyAndSupports: { [key: string]: string };
    infantInformation: { [key: string]: string };
    referralsAndServices: { [key: string]: string };
    relapsePreventionPlan: { [key: string]: string };
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
    },
    psychiatricHistory: {
      diagnoses: "Diagnoses",
      notes: "Notes",
    },
    medicalServicesForSubstanceUse: {
      mat_engaged: "Medication Assisted Treatment (MAT) Engaged",
      date_used_mat: "Date of Last MAT Use",
      medications: "Medications",
      mat_clinic_name: "MAT Clinic Name",
      mat_clinic_phone: "MAT Clinic Contact Information",
      used_addiction_medicine_services: "Addiction Medicine Services",
      date_used_medicine_service: "Date of Last Medicine Service",
      addiction_medicine_clinic: "Addiction Medicine Clinic",
      addiction_medicine_clinic_phone: "Addiction Medicine Clinic Contact Information",
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
      other_drugs: "Other",
      notes: "Notes",
    },
    drugScreeningResults: {
      tests: "Tests",
    },
    familyAndSupports: {
      people_living_in_home: "List of People Living in the Home",
      clients_children_not_living_in_home: "List of Clients Children NOT Living in the Home",
      notes: "Notes",
      current_support_system: "Current Support System",
      strength_of_client_and_support_system: "Strengths of Client and Support System",
      goals: "Goals",
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
      father_notes: "Father Notes",
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
      support_services_other: "Support Services Other",
      breastfeeding_support: "Breastfeeding Support",
      local_food_pantries: "Local Food Pantries",
      snap: "SNAP",
      women_infants_children: "Women, Infants, and Children",
      food_nutrition_other: "Food Nutrition Other",
      health_insurance_enrollment: "Health Insurance Enrollment",
      prenatal_healthcare: "Prenatal Healthcare",
      family_planning: "Family Planning",
      primary_care: "Primary Care",
      mental_health_counseling: "Mental Health Counseling",
      smoking_cessation: "Smoking Cessation",
      healthcare_other: "Healthcare Other",
      residential: "Residential",
      outpatient: "Outpatient",
      caring_for_two_program: "Caring for Two Program",
      the_cradles_program: "The Cradles Program",
      recovery_support_services: "Recovery Support Services",
      medication_assisted_treatment: "Medication Assisted Treatment",
      substance_use_treatment_other: "Substance Use Treatment Other",
      early_childhood_intervention: "Early Childhood Intervention",
      early_head_start: "Early Head Start",
      NCI_childcare_subsidy: "NCI Childcare Subsidy",
      pediatrician_primary_care: "Pediatrician Primary Care",
      safe_sleep_education: "Safe Sleep Education",
      child_related_other: "Child Related Other ",
      child_protective_service: "Child Protective Service",
      legal_aid: "Legal Aid",
      specialty_court: "Specialty Court",
      legal_assistance_other: "Legal Assistance Other",
      additional_notes: "Additional Notes",
    },
    relapsePreventionPlan: {
      three_things_that_trigger_desire_to_use: "Three things that trigger your desire to use",
      three_skills_you_enjoy: "Three skills you enjoy",
      three_people_to_talk_to: "Three people to talk to",
      safe_caregivers: "Safe Caregivers",
      have_naloxone: "Have Naloxone",
      comments: "Comments",
    },
  };

  const MaternalMedicalHistoryMedicationList = (data: any) => {
    return data.map((x: any, index: any) => {
      return (
        <div key={index}>
          <div> Name: {x.name} </div>
          <div> Dose: {x.dose} </div>
          <div> Prescriber: {x.prescriber} </div>
          <div> Notes: {x.notes} </div>
        </div>
      );
    });
  };

  const PscyhiatricHistoryDiagnoses = (data: any) => {
    return data.map((x: any, index: any) => {
      return (
        <div key={index}>
          <div> Provider: {x.provider} </div>
          <div> Phone Number: {x.phone_number} </div>
          <div> Diagnosis: {x.diagnosis} </div>
          <div> Date of Diagnosis: {x.date_of_diagnosis} </div>
          <div> Currently taking medication: {x.taking_medication} </div>
        </div>
      );
    });
  };

  const MedicalServicesForSubstanceUseMedications = (data: any) => {
    return data.map((x: any, index: any) => {
      return (
        <div key={index}>
          <div> Medication: {x.medication} </div>
          <div> Dose: {x.dose} </div>
        </div>
      );
    });
  };

  const SubstanceUseHistoryDrugs = (data: any) => {
    const namesMap: { [key: string]: string } = {
      ever_used: "Ever Used",
      date_last_used: "Date Last Used",
      notes: "Notes",
      used_during_pregnancy: "Used During Pregnancy",
    };

    return (
      <div>
        {Object.keys(data).map((item, index) => (
          <div key={index}>
            <div>
              {namesMap[item] || item}: {data[item]}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const SubstanceUseHistoryOtherDrugs = (data: any) => {
    return data.map((x: any, index: any) => {
      return (
        <div key={index}>
          <div> Name: {x.drug_used} </div>
          <div> Used During Pregnancy?: {x.used_during_pregnancy} </div>
          <div> Date Last Used: {x.date_last_used} </div>
          <div> Notes: {x.notes} </div>
        </div>
      );
    });
  };

  const DrugScreeningResultsTests = (data: any) => {
    return data.map((x: any, index: any) => {
      return (
        <div key={index}>
          <div> Test: {x.test_ordered} </div>
          <div> Date of Test: {x.date_collected} </div>
          <div> Provider name: {x.provider} </div>
          <div> Provider Location: {x.provider_location} </div>
          <div> Test Results: {x.results} </div>
          <div> Test Results Specification: {x.specify_results} </div>
          <div> Reviewed with Provider: {x.provider_reviewed} </div>
          <div> Date Reviewed: {x.date_reviewed} </div>
        </div>
      );
    });
  };

  const FamilyAndSupportsPeopleInHome = (data: any) => {
    return data.map((x: any, index: any) => {
      return (
        <div key={index}>
          <div> Person: {x.person} </div>
          <div> Date of Birth: {x.date_of_birth} </div>
          <div> Relation: {x.relation} </div>
        </div>
      );
    });
  };

  const FamilyAndSupportsChildrenNotHome = (data: any) => {
    return data.map((x: any, index: any) => {
      return (
        <div key={index}>
          <div> Person: {x.person} </div>
          <div> Date of Birth: {x.date_of_birth} </div>
          <div> Caregiver: {x.caregiver} </div>
          <div> Caregiver Contact Number: {x.caregiver_number} </div>
        </div>
      );
    });
  };

  const InfantInformationInfantCareNeeds = (data: any) => {
    const namesMap: { [key: string]: string } = {
      breast_pump: "Breast Pump",
      breast_pump_notes: "Breast Pump Notes",
      breastfeeding_support: "Breastfeeding Support",
      breastfeeding_support_notes: "Breastfeeding Support Notes",
      car_seat: "Car Seat",
      car_seat_notes: "Car Seat Notes",
      childcare: "Childcare",
      childcare_notes: "Childcare Notes",
      clothing: "Clothing",
      clothing_notes: "Clothing Notes",
      crib: "Crib",
      crib_notes: "Crib Notes",
      diapers: "Diapers",
      diapers_notes: "Diapers Notes",
      infant_formula: "Infant Formula",
      infant_formula_notes: "Infant Formula Notes",
      infant_stroller: "Infant Stroller",
      infant_stroller_notes: "Infant Stroller Notes",
      other: "Other",
      other_name: "Other Name",
      other_notes: "Other Notes",
    };

    return (
      <div>
        {data.map((item: any, index: number) => (
          <div key={index}>
            {Object.keys(item).map((key: string, idx: number) => (
              <div key={idx}>
                <div>
                  {namesMap[key] || key}: {item[key]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const InfantInformationMedications = (data: any) => {
    return data.map((x: any, index: any) => {
      return (
        <div key={index}>
          <div> Medication: {x.medication} </div>
          <div> Dose: {x.dose} </div>
          <div> Prescriber: {x.prescriber} </div>
          <div> Notes: {x.notes} </div>
        </div>
      );
    });
  };

  const ReferralsAndServices = (data: any) => {
    const namesMap: { [key: string]: string } = {
      status: "Status",
      organization: "Organization",
      organization_contact_information: "Organization Contact Info",
    };

    return (
      <div>
        {Object.keys(data).map((item, index) => (
          <div key={index}>
            <div>
              {namesMap[item] || item}: {data[item]}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ReferralsAndServicesOther = (data: any) => {
    return data.map((x: any, index: any) => {
      return (
        <div key={index}>
          <div> Name: {x.name} </div>
          <div> Status: {x.service_status} </div>
          <div> Organization: {x.organization} </div>
          <div> Organization Contact: {x.organization_contact_information} </div>
        </div>
      );
    });
  };

  const RelapsePreventionPlanSafeCaregivers = (data: any) => {
    return data.map((x: any, index: any) => {
      return (
        <div key={index}>
          <div> Name: {x.name} </div>
          <div> Contact Number: {x.contact_number} </div>
          <div> Relationship: {x.relationship} </div>
        </div>
      );
    });
  };

  const renderFields = (fields: { [key: string]: string }) => {
    return (
      <div className="grid grid-cols-1 gap-x-2 md:grid-cols-3 gap-y-1 py-2 text-sm">
        {Object.entries<string>(fields).map(([key, fieldName]) => (
          <React.Fragment key={key}>
            <div className="flex flex-row gap-1">
              <div className="font-semibold">{fieldName}:</div>
              {fieldNames.maternalMedicalHistory[key] && key === "current_medication_list" ? (
                MaternalMedicalHistoryMedicationList((formData as any)?.[key] || [])
              ) : fieldNames.psychiatricHistory[key] && key === "diagnoses" ? (
                PscyhiatricHistoryDiagnoses((formData as any)?.[key] || [])
              ) : fieldNames.medicalServicesForSubstanceUse[key] && key === "medications" ? (
                MedicalServicesForSubstanceUseMedications((formData as any)?.[key] || [])
              ) : fieldNames.substanceUseHistory[key] && key !== "notes" && key !== "other_drugs" ? (
                SubstanceUseHistoryDrugs((formData as any)?.[key] || [])
              ) : fieldNames.substanceUseHistory[key] && key === "other_drugs" ? (
                SubstanceUseHistoryOtherDrugs((formData as any)?.[key] || [])
              ) : fieldNames.drugScreeningResults[key] && key === "tests" ? (
                DrugScreeningResultsTests((formData as any)?.[key] || [])
              ) : fieldNames.familyAndSupports[key] && key === "people_living_in_home" ? (
                FamilyAndSupportsPeopleInHome((formData as any)?.[key] || [])
              ) : fieldNames.familyAndSupports[key] && key === "clients_children_not_living_in_home" ? (
                FamilyAndSupportsChildrenNotHome((formData as any)?.[key] || [])
              ) : fieldNames.infantInformation[key] && key === "infant_care_needs_items" ? (
                InfantInformationInfantCareNeeds((formData as any)?.[key] || [])
              ) : fieldNames.infantInformation[key] && key === "infant_medications" ? (
                InfantInformationMedications((formData as any)?.[key] || [])
              ) : fieldNames.referralsAndServices[key] &&
                !["additional_notes",
                  "support_services_other",
                  "food_nutrition_other",
                  "healthcare_other",
                  "substance_use_treatment_other",
                  "child_related_other",
                  "legal_assistance_other"].includes(key) ? (
                ReferralsAndServices((formData as any)?.[key] || [])
              ) : fieldNames.referralsAndServices[key] &&
                ["support_services_other",
                  "food_nutrition_other",
                  "healthcare_other",
                  "substance_use_treatment_other",
                  "child_related_other",
                  "legal_assistance_other"].includes(key) ? (
                ReferralsAndServicesOther((formData as any)?.[key] || [])
              ) : fieldNames.relapsePreventionPlan[key] && key === "safe_caregivers" ? (
                RelapsePreventionPlanSafeCaregivers((formData as any)?.[key] || [])
              ) : (
                <div>{(formData as any)?.[key]}</div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const handleAccordionClick = () => {
    console.log(`Accordion clicked: ${name}`);
    if (!submissionsFetched) {
      fetchSubmissions();
    }
  };

  return (
    <div>
      <Accordion title={name} completed={completed} isLoading={isLoading} onClick={handleAccordionClick}>
        {name === "Maternal Demographics" && formData && renderFields(fieldNames.maternalDemographics)}
        {name === "Maternal Medical History" && formData && renderFields(fieldNames.maternalMedicalHistory)}
        {name === "Psychiatric History" && formData && renderFields(fieldNames.psychiatricHistory)}
        {name === "Substance Use History" && formData && renderFields(fieldNames.substanceUseHistory)}
        {name === "Medical Services For Substance Use" && formData && renderFields(fieldNames.medicalServicesForSubstanceUse)}
        {name === "Drug Screening Results" && formData && renderFields(fieldNames.drugScreeningResults)}
        {name === "Family & Supports" && formData && renderFields(fieldNames.familyAndSupports)}
        {name === "Infant Information" && formData && renderFields(fieldNames.infantInformation)}
        {name === "Referrals and Services" && formData && renderFields(fieldNames.referralsAndServices)}
        {name === "Relapse Prevention Plan" && formData && renderFields(fieldNames.relapsePreventionPlan)}

        <div className="flex justify-between mt-6">
          <div className="flex">{renderSubmissions()}</div>
          <div className="flex">
            <Link to={path} className="button-filled font-semibold">
              New Submission
            </Link>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default FormSelector;