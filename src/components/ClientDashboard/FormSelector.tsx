import React from "react";

interface FormSelectorProps {
  name: string;
}

const FormSelector: React.FC<FormSelectorProps> = ({ name }) => {
  return (
    <div className="mt-8 flex flex-col gap-2">
      <div className="collapse collapse-arrow bg-gray-200">
        <input type="checkbox" className="peer" />
        <div className="collapse-title ">
          {name}
        </div>
        <div className="collapse-content">
          <p>hello</p>
        </div>
      </div>
    </div>
  )

};

export default FormSelector;
