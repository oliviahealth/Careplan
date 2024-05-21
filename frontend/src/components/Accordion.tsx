import React, { useState, useRef, useEffect } from 'react';
import Chevron from './Chevron';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  // completed?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isLoading,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (isOpen) {
      setMaxHeight(`${contentRef.current?.scrollHeight}px`);
    } else {
      setMaxHeight('0px');
    }
  }, [isOpen, children, maxHeight]);

  return (
    <>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          onClick && onClick();
        }}
        className={`w-full h-fit py-3 px-6 rounded-2xl bg-neutral-100 flex justify-between items-center text-lg border-2 transition duration-100 ease-in ${isOpen ? 'border-[#5D1B2A]' : 'border-transparent '}`}
      >
        {title}
        <div className="flex flex-row gap-10">
          <Chevron
            className="stroke-black h-4"
            direction={`${isOpen ? 'up' : 'down'}`}
          ></Chevron>
        </div>
      </div>
      <div
        className="px-6 overflow-hidden transition-all duration-300 ease-in-out"
        ref={contentRef}
        style={{
          maxHeight: `${maxHeight}`,
        }}
      >
        {isLoading ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-full h-10 m-5 animate-spin"
          >
            <path
              className="fill-neutral-300"
              d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"
            />
          </svg>
        ) : (
          children
        )}
      </div>
    </>
  );
};

export default Accordion;
