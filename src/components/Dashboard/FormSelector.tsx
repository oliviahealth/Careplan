import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { useMutation } from 'react-query';
// import useForm from 'react-hook-form';
// import { z } from 'zod'

interface FormSelectorProps {
  name: string;
  path: string;
  apiUrl: string;
  formUrl: string;
}

const FormSelector: React.FC<FormSelectorProps> = ({
  name,
  path,
  apiUrl,
  formUrl,
}) => {
  const [data, setData] = useState<Record<string, string | null>>({});
  const [completed, setIsCompleted] = useState<boolean>(true);

  useEffect(() => {
    let allFieldsCompleted = true;
    Object.entries(data).forEach(([key, value]) => {
      if (!excludedKeys.includes(key) && (value === "" || value === null)) {
        allFieldsCompleted = false;
      }
    });
    setIsCompleted(allFieldsCompleted);
  }, [data]);

  const options = {
    method: "GET",
    url: `${apiUrl}/${formUrl}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const getData = async () => {
    const response = await axios.get(options.url, options);
    console.log(response.data);
    setData(response.data);
  };

  const maternalDemographicsFieldNames: { [key: string]: string } = {
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
  };

  const excludedKeys: string[] = ["user_id", "id"];

  return (
    <div
      className="collapse collapse-arrow"
      onClick={async () => {
        await getData();
      }}
    >
      <input type="checkbox" className="peer" />
      <div className="collapse-title rounded-2xl items-center flex bg-gray-200 justify-between">
        {name}
        <div className="flex flex-row text-red-500">
          {completed ? (
            ""
          ) : (
            <>
              <img className="w-4 mr-2" src={`./images/action.svg`} />
              Actions Required
            </>
          )}
        </div>
      </div>
      <div className="collapse-content mt-2 flex flex-col bg-white">
        {data && (
          <div className="grid grid-cols-3 py-2 text-sm">
            {Object.entries<string>(maternalDemographicsFieldNames)
              .filter(([key]) => !excludedKeys.includes(key))
              .map(([key, fieldName]) => (
                <React.Fragment key={key}>
                  <div className="flex flex-row gap-1">
                    <div className="font-semibold">{fieldName}:</div>
                    <div>{data?.[key]}</div>
                  </div>
                </React.Fragment>
              ))}
          </div>
        )}
        <div className="flex justify-end">
          <Link to={path} className="button-filled font-semibold">
            Edit
          </Link>
        </div>
      </div>
    </div>
    // <>
    //   <button
    //     className="w-full h-fit py-3 px-6 rounded-2xl bg-gray-200 flex justify-between text-lg"
    //     onClick={toggleSelected}
    //   >
    //     <div>{name}</div>
    //     <div className="flex gap-10 items-center">
    //       <div className="flex flex-row text-red-500">
    //         {completed ? (
    //           <>
    //             <img className="w-4 mr-2" src={`./images/action.svg`} />
    //             Actions Required
    //           </>
    //         ) : (
    //           ""
    //         )}
    //       </div>
    //         <svg
    //           width="15"
    //           height="26"
    //           viewBox="0 0 15 26"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //           style={{ transform: `rotate(90deg)` }}
    //           className={`h-5 stroke-black`}
    //         >
    //           <path
    //             d="M2 24L13 13L2 2"
    //             strokeWidth="4"
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //           />
    //         </svg>
    //     </div>
    //   </button>
    //   <div className="px-6 text-sm">
    //     {isSelected ? "Selected form content" : ""}
    //   </div>
    // </>
  );
};

export default FormSelector;
