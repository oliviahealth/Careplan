import React from 'react';

interface ChildSelectorProps {
  isSelected?: boolean;
  actionsRequired?: boolean;
}

const ChildSelector: React.FC<ChildSelectorProps> = ({
  isSelected,
  actionsRequired,
}) => {
  return (
    <div className={`w-full h-fit rounded-xl border-2 p-4 flex justify-between items-center ${isSelected ? "border-[#D0BABA]" : "border-gray-200"}`}>
      <div className="flex flex-col gap-1 text-sm">
        <div className="font-semibold">First Name Last Name</div>
        <div className="flex flex-row">
          <img className="w-3 mr-2" src={`./images/${actionsRequired ? "action" : "check"}.svg`} />
          <div className={`text-xs ${actionsRequired ? "text-red-500" : "text-gray-400"}`}>
            {actionsRequired ? "Actions Required" : "No Actions Required"}
          </div>
        </div>
      </div>
      <svg
        viewBox="0 0 15 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `rotate(0deg)` }}
        className={`h-5 ${isSelected ? "stroke-[#D0BABA]" : "stroke-gray-200"}`}
      >
        <path
          d="M2 24L13 13L2 2"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ChildSelector;