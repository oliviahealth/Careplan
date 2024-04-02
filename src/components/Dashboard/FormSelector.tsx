import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';

interface FormSelectorProps {
  name: string;
  path: string;
  apiUrl: string;
  completed?: boolean;
}

interface UserData {
  userId: string;
}

const FormSelector: React.FC<FormSelectorProps> = ({ name, path, apiUrl, completed = true }) => {

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { "user_id": "d2bd4688-5527-4bbb-b1a8-af1399d00b12" };
        const response = await axios.get<UserData>(apiUrl, {
          params,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl]); 

  return (
    <div className="collapse collapse-arrow">
      <input type="checkbox" className="peer" />
      <div className="collapse-title rounded-2xl items-center flex bg-gray-200 justify-between">{name}
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
        <div className="grid grid-cols-3 py-2 text-sm">
          <div>1</div>
          <div>1</div>
          <div>1</div>
        </div>
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
