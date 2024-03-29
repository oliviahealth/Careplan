import { FunctionComponent } from "react";

interface FormSelectorProps {
  isSelected?: boolean;
  completed?: boolean;
}

const FormSelector: FunctionComponent<FormSelectorProps> = ({isSelected, completed}) => {
  return (
    <div className="w-full h-fit p-5 rounded-xl bg-gray-200"></div>
  );
};

export default FormSelector;
