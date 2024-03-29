import React from 'react';
import Chevron from './Chevron';

interface ChildSelectorProps {
  isSelected?: boolean;
  actionsRequired?: boolean;
}

const ChildSelector: React.FC<ChildSelectorProps> = ({
  isSelected,
  actionsRequired,
}) => {
  return (
    <div className={`w-full h-fit rounded-xl border-2 p-4 flex justify-between items-center ${isSelected ? "border-[#D0BABA]": "border-gray-200"}`}>
      <div className="flex flex-col gap-1 text-sm">
        <div className="font-semibold">First Name Last Name</div>
        <div className="flex flex-row">
          <img className="w-5 mr-1" src="./vite.svg" />
          <div className={`${actionsRequired ? "text-red-500" : "text-gray-400"}`}>
            {actionsRequired ? "Actions Required" : "No Actions Required"}
          </div>
        </div>
      </div>
      <Chevron className='h-5 stroke-gray-200' direction='right'></Chevron>
    </div>
  );
};

export default ChildSelector;
