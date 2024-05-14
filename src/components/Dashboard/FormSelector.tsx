import React, { /*useEffect,*/ useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Accordion from "../Accordion";
import useAppStore from "../../store/useAppStore";
import { CurrentMedicationList } from "../Forms/MaternalMedicalHistory";
import { Diagnoses } from "../Forms/PsychiatricHistory";
import { SubstanceUseMedications } from "../Forms/MedicalServicesForSubstanceUse";
import { AdditionalDrugs, Drugs } from "../Forms/SubstanceUseHistory";
import { DrugTests } from "../Forms/DrugScreeningResults";
import { Children, HouseholdMembers } from "../Forms/FamilyAndSupports";
import { InfantCareNeeds, InfantMeds } from "../Forms/InfantInformation";
import { AdditionalServices, Services } from "../Forms/ReferralsAndServices";
import { Caregivers } from "../Forms/RelapsePreventionPlan";

interface FormSelectorProps {
  name: string;
  path: string;
  apiUrl: string;
}

interface Submission {
  [key: string]: string | null;
  id: string;
  date_created: string;
  date_last_modified: string;
}

const FormSelector: React.FC<FormSelectorProps> = ({
  name,
  path,
  apiUrl
}) => {
  const [formData, setFormData] = useState<Record<string, string | null>>({});
  // const [completed, setCompleted] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmissionID, setSelectedSubmissionID] = useState<string | null>(null);
  const [submissionsFetched, setSubmissionsFetched] = useState<boolean>(false);
  const [submissionsExist, setSubmissionsExist] = useState<{ [key: string]: boolean }>({});

  const updateSubmissionsExist = (key: string, value: boolean) => {
    setSubmissionsExist(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const user = useAppStore((state) => state.user);
  const access_token = useAppStore((state) => state.access_token);

  const headers = {
    "Authorization": "Bearer " + access_token,
    "userId": user?.id,
  }

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/get_${apiUrl}`,
        { headers: { ...headers } }
      );
      const allSubmissions = response.data;
      setSubmissions(allSubmissions);

      if (allSubmissions.length > 0) {
        setFormData(allSubmissions[allSubmissions.length - 1]);
        setSelectedSubmissionID(allSubmissions[allSubmissions.length - 1].id);
        updateSubmissionsExist(apiUrl, true);
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
          `http://127.0.0.1:5000/api/delete_${apiUrl}/${submissionID}`,
          { headers: { ...headers } }
        );
        fetchSubmissions();
        setFormData({});
      } catch (error) {
        console.error("Error deleting submission:", error);
      }
    }
  };

  const renderSubmissions = () => {

    const sortedSubmissions = [...submissions].sort((a: Submission, b: Submission) => {
      const dateA = new Date(a.date_created);
      const dateB = new Date(b.date_created);
      return dateA.getTime() - dateB.getTime();
    });

    return (
      <div className="relative flex space-x-2 items-center">
        {selectedSubmissionID && (
          <>
            <select
              value={selectedSubmissionID || ""}
              onChange={(e) => handleSubmissionClick(e.target.value)}
              className="block bg-white border border-neutral-300 hover:border-neutral-400 px-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {sortedSubmissions.map((submission: Submission) => (
                <option key={submission.id} value={submission.id}>
                  Submission{" "}
                  {new Date(submission.date_created).toLocaleString("en-US", {
                    timeZone: "America/Chicago",
                  })}{" "}
                  CST
                </option>
              ))}
            </select>
            <Link to={`${path}/${selectedSubmissionID}`}>
              <img className="w-8 h-8" src="./images/edit.svg"></img>
            </Link>
            <button onClick={() => handleDeleteSubmission(selectedSubmissionID)}>
              <img className="w-8 h-8" src="./images/delete.svg"></img>
            </button>
          </>
        )}
      </div>
    );
  };

  // useEffect(() => {
  //   let allFieldsCompleted = true;
  //   Object.entries(formData).forEach(([_key, value]) => {
  //     if (value === "" || value === null) {
  //       allFieldsCompleted = false;
  //     }
  //   });
  //   setCompleted(allFieldsCompleted);
  // }, [formData]);

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
      mat_engaged: "MAT Engaged",
      date_used_mat: "Date of Last MAT Use",
      medications: "Medications",
      mat_clinic_name: "MAT Clinic Name",
      mat_clinic_phone: "MAT Clinic Contact Information",
      used_addiction_medicine_services: "Addiction Medicine Services",
      date_used_medicine_service: "Date of Last Medicine Service",
      addiction_medicine_clinic: "Addiction Medicine Clinic",
      addiction_medicine_clinic_phone: "Addiction Medicine Clinic Contact Info",
    },
    substanceUseHistory: {
      alcohol: "Alcohol",
      benzodiazepines: "Benzodiazepines",
      cocaine: "Cocaine",
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

  const MaternalMedicalHistoryMedicationList = (data: CurrentMedicationList[]) => {
    return data.map((x, index) => {
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

  const PsychiatricHistoryDiagnoses = (data: Diagnoses[]) => {
    return data.map((x, index) => {
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

  const MedicalServicesForSubstanceUseMedications = (data: SubstanceUseMedications[]) => {
    return data.map((x, index) => {
      return (
        <div key={index}>
          <div> Medication: {x.medication} </div>
          <div> Dose: {x.dose} </div>
        </div>
      );
    });
  };

  const SubstanceUseHistoryDrugs = (data: Drugs | null | undefined) => {

    const namesMap: { [key: string]: string } = {
      ever_used: "Ever Used",
      date_last_used: "Date Last Used",
      notes: "Notes",
      used_during_pregnancy: "Used During Pregnancy",
    };

    return (
      <div>
        {Object.keys(namesMap).map((key) => (
          <div key={key}>
            {namesMap[key]}: {data?.[key as keyof Drugs] || 'N/A'}
          </div>
        ))}
      </div>
    );
  };

  const SubstanceUseHistoryOtherDrugs = (data: AdditionalDrugs[]) => {
    return data.map((x, index) => {
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

  const DrugScreeningResultsTests = (data: DrugTests[]) => {
    return data.map((x, index) => {
      return (
        <div key={index}>
          <div> Test Description: {x.test_ordered} </div>
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

  const FamilyAndSupportsPeopleInHome = (data: HouseholdMembers[]) => {
    return data.map((x, index) => {
      return (
        <div key={index}>
          <div> Person: {x.person} </div>
          <div> Date of Birth: {x.date_of_birth} </div>
          <div> Relation: {x.relation} </div>
        </div>
      );
    });
  };

  const FamilyAndSupportsChildrenNotHome = (data: Children[]) => {
    return data.map((x, index) => {
      return (
        <div key={index}>
          <div> Person: {x.name} </div>
          <div> Date of Birth: {x.date_of_birth} </div>
          <div> Caregiver: {x.caregiver} </div>
          <div> Caregiver Contact Number: {x.caregiver_number} </div>
        </div>
      );
    });
  };

  const InfantInformationInfantCareNeeds = (data: InfantCareNeeds[]) => {
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
        {data.map((item, index: number) => (
          <div key={index}>
            {Object.keys(item).map((key: string, idx: number) => (
              <div key={idx}>
                <div>
                  {namesMap[key] || key}: {item[key as keyof InfantCareNeeds]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const InfantInformationMedications = (data: InfantMeds[]) => {
    return data.map((x, index) => {
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

  const ReferralsAndServices = (data: Services | null | undefined) => {

    const namesMap: { [key: string]: string } = {
      service_status: "Status",
      organization: "Organization",
      organization_contact_information: "Organization Contact Info",
    };

    return (
      <div>
        {Object.keys(namesMap).map((key) => (
          <div key={key}>
            {namesMap[key]}: {data?.[key as keyof Services] || 'N/A'}
          </div>
        ))}
      </div>
    );
  };

  const ReferralsAndServicesOther = (data: AdditionalServices[]) => {
    return data.map((x, index) => {
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

  const RelapsePreventionPlanSafeCaregivers = (data: Caregivers[]) => {
    return data.map((x, index) => {
      return (
        <div key={index}>
          <div> Name: {x.name} </div>
          <div> Contact Number: {x.contact_number} </div>
          <div> Relationship: {x.relationship} </div>
        </div>
      );
    });
  };

  interface MaternalMedicalHistoryData {
    [key: string]: string | CurrentMedicationList[] | null;
    current_medication_list: CurrentMedicationList[];
  }

  interface PsychiatricHistoryData {
    [key: string]: string | Diagnoses[] | null;
    diagnoses: Diagnoses[];
  }
  interface MedicalServicesForSubstanceUseData {
    [key: string]: string | SubstanceUseMedications[] | null;
    medications: SubstanceUseMedications[];
  }

  interface SubstanceUseHistoryData {
    [key: string]: string | Drugs | AdditionalDrugs[] | null;
    alcohol: Drugs,
    benzodiazepines: Drugs,
    cocaine: Drugs,
    heroin: Drugs,
    kush: Drugs,
    marijuana: Drugs,
    methamphetamine: Drugs,
    prescription_drugs: Drugs,
    tobacco: Drugs,
    other_drugs: AdditionalDrugs[];
    notes: string | null;
  }

  interface DrugScreeningResultsData {
    [key: string]: string | DrugTests[] | null;
    tests: DrugTests[];
  }

  interface FamilyAndSupportsData {
    [key: string]: string | HouseholdMembers[] | Children[] | null;
    people_living_in_home: HouseholdMembers[];
    clients_children_not_living_in_home: Children[];
  }

  interface InfantInformationData {
    [key: string]: string | InfantCareNeeds[] | InfantMeds[] | null;
    infant_care_needs_items: InfantCareNeeds[];
    infant_medications: InfantMeds[];
  }

  interface ReferralsAndServicesData {
    [key: string]: string | Services | AdditionalServices[] | null;
    parenting_classes: Services;
    transportation_services: Services;
    ssi_disability: Services;
    temporary_assistance_for_needy_families: Services;
    personal_safety: Services;
    home_visitation_program: Services;
    housing_assistance: Services;
    healthy_start_program: Services;
    support_services_other: AdditionalServices[];
    breastfeeding_support: Services;
    local_food_pantries: Services;
    snap: Services;
    women_infants_children: Services;
    food_nutrition_other: AdditionalServices[];
    health_insurance_enrollment: Services;
    prenatal_healthcare: Services;
    family_planning: Services;
    primary_care: Services;
    mental_health_counseling: Services;
    smoking_cessation: Services;
    healthcare_other: AdditionalServices[];
    residential: Services;
    outpatient: Services;
    caring_for_two_program: Services;
    the_cradles_program: Services;
    recovery_support_services: Services;
    medication_assisted_treatment: Services;
    substance_use_treatment_other: AdditionalServices[];
    early_childhood_intervention: Services;
    early_head_start: Services;
    NCI_childcare_subsidy: Services;
    pediatrician_primary_care: Services;
    safe_sleep_education: Services;
    child_related_other: AdditionalServices[];
    child_protective_service: Services;
    legal_aid: Services;
    specialty_court: Services;
    legal_assistance_other: AdditionalServices[];
    additional_notes: string | null;
  }

  interface RelapsePreventionPlanData {
    [key: string]: string | Caregivers[] | null;
    safe_caregivers: Caregivers[];
  }

  const renderMaternalDemographics = (fields: { [key: string]: string }) => {
    const personalInformationFields = ['name', 'date_of_birth'];
    const contactFields = ['primary_phone_number', 'phone_type'];
    const insuranceFields = ['marital_status', 'insurance_plan', 'effective_date', 'subscriber_id', 'group_id'];
    const emergencyContactFields = ['emergency_contact', 'emergency_contact_phone', 'relationship'];
  
    const getAddressString = () => {
      const { street_address, city, state, zip_code } = formData;
      return `${street_address} ${city}, ${state} ${zip_code}`
    };
  
    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };
  
    const formatPhoneNumber = (phoneNumber: string) => {
      const cleaned = phoneNumber.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]})-${match[2]}-${match[3]}`;
      }
      return phoneNumber;
    };
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
        <div className="col-span-2"></div>
        <div className="  rounded-lg p-4 bg-neutral-100">
          <h3 className="text-lg mb-4" style={{ color: '#797474' }}>Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalInformationFields.map(key => {
              const formDataKey = key as keyof typeof formData;
              const fieldName = fields[key];
              const fieldValue = formData && formData[formDataKey];
              const formattedValue = key === 'date_of_birth' && fieldValue ? formatDate(fieldValue) : fieldValue || 'N/A';
              return (
                <div key={key}>
                  <h4 className="text-xs mb-1" style={{ color: '#797474' }}>{fieldName}</h4>
                  <div className="font-semibold">{formattedValue}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="  rounded-lg p-4 bg-neutral-100" >
          <h3 className="text-lg mb-4" style={{ color: '#797474' }}>Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs mb-1" style={{ color: '#797474' }}>Address</h4>
              <div className="font-semibold">{getAddressString() || 'N/A'}</div>
            </div>
            {contactFields.map(key => {
              const formDataKey = key as keyof typeof formData;
              const fieldName = fields[key];
              const fieldValue = formData && formData[formDataKey];
              const formattedValue = key === 'primary_phone_number' && fieldValue ? formatPhoneNumber(fieldValue) : fieldValue || 'N/A';
              return (
                <div key={key}>
                  <h4 className="text-xs mb-1" style={{ color: '#797474' }}>{fieldName}</h4>
                  <div className="font-semibold">{formattedValue}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="  rounded-lg p-4 bg-neutral-100">
          <h3 className="text-lg mb-4" style={{ color: '#797474' }}>Insurance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insuranceFields.map(key => {
              const formDataKey = key as keyof typeof formData;
              const fieldName = fields[key];
              const fieldValue = formData && formData[formDataKey];
              const formattedValue = key === 'effective_date' && fieldValue ? formatDate(fieldValue) : fieldValue || 'N/A';
              return (
                <div key={key}>
                  <h4 className="text-xs mb-1" style={{ color: '#797474' }}>{fieldName}</h4>
                  <div className="font-semibold">{formattedValue}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="  rounded-lg p-4 bg-neutral-100">
          <h3 className="text-lg mb-4" style={{ color: '#797474' }}>Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContactFields.map(key => {
              const formDataKey = key as keyof typeof formData;
              const fieldName = fields[key];
              const fieldValue = formData && formData[formDataKey];
              const formattedValue = key === 'emergency_contact_phone' && fieldValue ? formatPhoneNumber(fieldValue) : fieldValue || 'N/A';
              return (
                <div key={key}>
                  <h4 className="text-xs mb-1" style={{ color: '#797474' }}>{fieldName}</h4>
                  <div className="font-semibold">{formattedValue}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  
  const renderMaternalMedicalHistory = (fields: { [key: string]: string }) => {
    const prenatalCareFields = [
      "gestational_age",
      "anticipated_delivery_date",
      "planned_mode_delivery",
      "actual_mode_delivery",
      "attended_postpartum_visit",
      "postpartum_visit_date",
      "postpartum_visit_location"
    ];
    const obstetricHistoryFields = [
      "total_num_pregnancies",
      "total_num_live_births",
      "total_num_children_with_mother",
      "prior_complications"
    ];
    const medicalProblemsFields = ["med_problems_diagnoses"];
  
    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };
  
    const medicationList = Array.isArray(formData?.current_medication_list)
      ? formData.current_medication_list
      : [];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
        <div className="  rounded-lg p-4 bg-neutral-100">
          <h3 className="text-lg mb-4" style={{ color: '#797474' }}>Prenatal Care</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prenatalCareFields.map(key => {
              const fieldName = fields[key];
              const fieldValue = formData?.[key];
              const formattedValue = (key === 'anticipated_delivery_date' || key === 'postpartum_visit_date') && fieldValue
                ? formatDate(fieldValue)
                : fieldValue || 'N/A';
              return (
                <div key={key}>
                  <h4 className="text-xs mb-1" style={{ color: '#797474' }}>{fieldName}</h4>
                  <div className="font-semibold">{formattedValue}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="  rounded-lg p-4 bg-neutral-100">
          <h3 className="text-lg mb-4" style={{ color: '#797474' }}>Obstetric History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {obstetricHistoryFields.map(key => {
              const fieldName = fields[key];
              const fieldValue = formData?.[key];
              return (
                <div key={key}>
                  <h4 className="text-xs mb-1" style={{ color: '#797474' }}>{fieldName}</h4>
                  <div className="font-semibold">{fieldValue || 'N/A'}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="  rounded-lg p-4 bg-neutral-100">
          <h3 className="text-lg mb-4" style={{ color: '#797474' }}>Medical Problems</h3>
          <div>
            {medicalProblemsFields.map(key => {
              const fieldName = fields[key];
              const fieldValue = formData?.[key];
              return (
                <div key={key}>
                  <h4 className="text-xs mb-1" style={{ color: '#797474' }}>{fieldName}</h4>
                  <div className="font-semibold">{fieldValue || 'N/A'}</div>
                </div>
              );
            })}
            <div className="mt-4">
              <h4 className="text-xs mb-1" style={{ color: '#797474' }}>Notes</h4>
              <div className="font-semibold">{formData?.notes || 'N/A'}</div>
            </div>
          </div>
        </div>
        <div className="  rounded-lg p-4 bg-neutral-100">
          <h3 className="text-lg mb-4" style={{ color: '#797474' }}>Current Medication List</h3>
          <div>
            {medicationList.map((medication: CurrentMedicationList, index: number) => (
              <div key={index} className="mb-4">
                <div className="font-semibold">{medication.name}</div>
                <div>Dose: {medication.dose}</div>
                <div>Prescriber: {medication.prescriber}</div>
                <div>Notes: {medication.notes}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  
  const renderFields = (fields: { [key: string]: string }) => {
    return (
      <div className="grid grid-cols-1 gap-x-2 md:grid-cols-3 gap-y-1 py-2 text-sm">
        {Object.entries<string>(fields).map(([key, fieldName]) => {
          const formDataKey = key as keyof typeof formData;
          return (
            <React.Fragment key={key}>
              <div className="flex flex-col gap-1">
                <div className="font-semibold truncate">{fieldName}</div>
                {(() => {
                  if (fieldNames.maternalMedicalHistory[key] && key === "current_medication_list") {
                    return (
                      <div>
                        {MaternalMedicalHistoryMedicationList(
                          Array.isArray((formData as MaternalMedicalHistoryData)?.[formDataKey])
                            ? ((formData as MaternalMedicalHistoryData)?.[formDataKey] as CurrentMedicationList[])
                            : []
                        )}
                      </div>
                    );
                  } else if (fieldNames.psychiatricHistory[key] && key === "diagnoses") {
                    return (
                      <div>
                        {PsychiatricHistoryDiagnoses(
                          Array.isArray((formData as PsychiatricHistoryData)?.[formDataKey])
                            ? ((formData as PsychiatricHistoryData)?.[formDataKey] as Diagnoses[])
                            : []
                        )}
                      </div>
                    );
                  } else if (fieldNames.medicalServicesForSubstanceUse[key] && key === "medications") {
                    return (
                      <div>
                        {MedicalServicesForSubstanceUseMedications(
                          Array.isArray((formData as MedicalServicesForSubstanceUseData)?.[formDataKey])
                            ? ((formData as MedicalServicesForSubstanceUseData)?.[formDataKey] as SubstanceUseMedications[])
                            : []
                        )}
                      </div>
                    );
                  } else if (fieldNames.substanceUseHistory[key]) {
                    if (key === "other_drugs") {
                      return (
                        <div>
                          {SubstanceUseHistoryOtherDrugs(
                            Array.isArray((formData as SubstanceUseHistoryData)?.[formDataKey])
                              ? ((formData as SubstanceUseHistoryData)?.[formDataKey] as AdditionalDrugs[])
                              : []
                          )}
                        </div>
                      );
                    } else if (key === "notes") {
                      return <div>{(formData as SubstanceUseHistoryData)?.[formDataKey] as string}</div>;
                    } else {
                      return (
                        <div>
                          {SubstanceUseHistoryDrugs(
                            (formData as SubstanceUseHistoryData)?.[formDataKey] as Drugs
                          )}
                        </div>
                      );
                    }
                  } else if (fieldNames.drugScreeningResults[key] && key === "tests") {
                    return (
                      <div>
                        {DrugScreeningResultsTests(
                          Array.isArray((formData as DrugScreeningResultsData)?.[formDataKey])
                            ? ((formData as DrugScreeningResultsData)?.[formDataKey] as DrugTests[])
                            : []
                        )}
                      </div>
                    );
                  } else if (fieldNames.familyAndSupports[key] && (key === "people_living_in_home")) {
                    return (
                      <div>
                        {FamilyAndSupportsPeopleInHome(
                          (formData as FamilyAndSupportsData)?.[formDataKey] as HouseholdMembers[]
                        )}
                      </div>
                    );
                  } else if (fieldNames.familyAndSupports[key] && (key === "clients_children_not_living_in_home")) {
                    return (
                      <div>
                        {FamilyAndSupportsChildrenNotHome(
                          (formData as FamilyAndSupportsData)?.[formDataKey] as Children[]
                        )}
                      </div>
                    );
                  } else if (fieldNames.infantInformation[key] && (key === "infant_care_needs_items")) {
                    return (
                      <div>
                        {InfantInformationInfantCareNeeds(
                          (formData as InfantInformationData)?.[formDataKey] as InfantCareNeeds[]
                        )}
                      </div>
                    );
                  } else if (fieldNames.infantInformation[key] && (key === "infant_medications")) {
                    return (
                      <div>
                        {InfantInformationMedications(
                          (formData as InfantInformationData)?.[formDataKey] as InfantMeds[]
                        )}
                      </div>
                    );
                  } else if (fieldNames.referralsAndServices[key]) {
                    if (["support_services_other",
                      "food_nutrition_other",
                      "healthcare_other",
                      "substance_use_treatment_other",
                      "child_related_other",
                      "legal_assistance_other"].includes(key)) {
                      return (
                        <div>
                          {ReferralsAndServicesOther(
                            Array.isArray((formData as ReferralsAndServicesData)?.[formDataKey])
                              ? ((formData as ReferralsAndServicesData)?.[formDataKey] as AdditionalServices[])
                              : []
                          )}
                        </div>
                      );
                    } else if (key === "additional_notes") {
                      return <div>{(formData as ReferralsAndServicesData)?.[formDataKey] as string}</div>;
                    } else {
                      return (
                        <div>
                          {ReferralsAndServices(
                            (formData as ReferralsAndServicesData)?.[formDataKey] as Services
                          )}
                        </div>
                      );
                    }
                  } else if (fieldNames.relapsePreventionPlan[key] && key === "safe_caregivers") {
                    return (
                      <div>
                        {RelapsePreventionPlanSafeCaregivers(
                          (formData as RelapsePreventionPlanData)?.[formDataKey] as Caregivers[]
                        )}
                      </div>
                    );
                  } else {
                    return <div>{(formData && formData[formDataKey]) || 'N/A'}</div>;
                  }
                })()}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const handleAccordionClick = () => {
    if (!submissionsFetched) {
      fetchSubmissions();
    }
  };

  return (
    <div>
      <Accordion title={name} isLoading={isLoading} onClick={handleAccordionClick}>
        {name === "Maternal Demographics" && formData && submissionsExist[apiUrl] && renderMaternalDemographics(fieldNames.maternalDemographics)}
        {name === "Maternal Medical History" && formData && submissionsExist[apiUrl] && renderMaternalMedicalHistory(fieldNames.maternalMedicalHistory)}
        {name === "Psychiatric History" && formData && submissionsExist[apiUrl] && renderFields(fieldNames.psychiatricHistory)}
        {name === "Substance Use History" && formData && submissionsExist[apiUrl] && renderFields(fieldNames.substanceUseHistory)}
        {name === "Medical Services For Substance Use" && formData && submissionsExist[apiUrl] && renderFields(fieldNames.medicalServicesForSubstanceUse)}
        {name === "Drug Screening Results" && formData && submissionsExist[apiUrl] && renderFields(fieldNames.drugScreeningResults)}
        {name === "Family & Supports" && formData && submissionsExist[apiUrl] && renderFields(fieldNames.familyAndSupports)}
        {name === "Infant Information" && formData && submissionsExist[apiUrl] && renderFields(fieldNames.infantInformation)}
        {name === "Referrals and Services" && formData && submissionsExist[apiUrl] && renderFields(fieldNames.referralsAndServices)}
        {name === "Relapse Prevention Plan" && formData && submissionsExist[apiUrl] && renderFields(fieldNames.relapsePreventionPlan)}

        <div className="flex justify-between mt-6">
          {submissionsExist[apiUrl] && (
            <div className="flex">{renderSubmissions()}</div>
          )}
          {!submissionsExist[apiUrl] && (
            <div className="flex">There are no submissions for this form. Please fill out a new submission.</div>
          )}
          <div className="flex">
            <Link to={path} className="button-filled rounded-full font-semibold">
              New Submission
            </Link>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default FormSelector;