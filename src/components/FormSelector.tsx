import React from "react";
import Chevron from "./Chevron";

interface FormSelectorProps {
  name: string;
  isSelected?: boolean;
  completed?: boolean;
}

const FormSelector: React.FC<FormSelectorProps> = ({
  name,
  isSelected,
  completed,
}) => {
  return (
    <>
      <div className="w-full h-fit py-3 px-6 rounded-2xl bg-gray-200 flex justify-between text-lg">
        <div>{name}</div>
        <div className="flex gap-10 items-center">
          <div className="flex flex-row text-red-500">
            {completed ? (
              <>
                <img className="w-4 mr-2" src={`./images/action.svg`} />
                Actions Required
              </>
            ) : (
              ""
            )}
          </div>{" "}
          <div>
            {isSelected ? (
              <Chevron className="h-5 stroke-black" direction="up" />
            ) : (
              <Chevron className="h-5 stroke-black" direction="down" />
            )}
          </div>
        </div>
      </div>
      <div className="px-6 text-sm">
        {isSelected ? "Selected form content" : ""}
      </div>
    </>
  );
};

export default FormSelector;
