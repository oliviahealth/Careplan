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
    }
  }

  const ShowMedicationList = (data: any) => {
    return data.map((x: any) => {
      return (
        <div>
          <div>
            Name: {x.name}
          </div>
          <div>
            Dose: {x.dose}
          </div>
          <div>
            Prescriber: {x.prescriber}
          </div>
          <div>
            Notes: {x.notes}
          </div>
        </div>
      )
    })
  }

  const pscyhiatricHistoryDiagnoses = (data: any) => {
    return data.map((x: any) => {
      return (
        <div>
          <div>
            Provider: {x.provider}
          </div>
          <div>
            Phone Number: {x.phone_number}
          </div>
          <div>
            Diagnosis: {x.diagnosis}
          </div>
          <div>
            Date of Diagnosis: {x.date_of_diagnosis}
          </div>
          <div>
            Currently taking medication: {x.taking_medication}
          </div>
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

  const renderFields = (fields: { [key: string]: string }) => {
    return (
      <div className="grid grid-cols-3 py-2 text-sm">
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
