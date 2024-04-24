import React, { useState, useRef, useEffect } from 'react';
import Chevron from './Chevron';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  completed?: boolean;
  onClick?: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ title, completed, children, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | 'auto'>(0);

  useEffect(() => {
    const handleContentHeight = () => {
      if (contentRef.current) {
        const newHeight = isOpen ? contentRef.current.scrollHeight : 0;
        setContentHeight(newHeight);
      }
    };

    handleContentHeight();
    window.addEventListener('resize', handleContentHeight);
    return () => window.removeEventListener('resize', handleContentHeight);
  }, [isOpen]);

  return (
    <div>
      <div
        onClick={() => {
            setIsOpen(!isOpen);
            onClick && onClick(); // Call onClick prop if provided
          }}
        className="w-full h-fit py-3 px-6 rounded-2xl bg-neutral-100 flex justify-between items-center"
      >
        {title}
        <div className="flex flex-row gap-10">
          <div className="flex flex-row text-red-500">
            {!completed && (
              <>
                <img className="w-4 mr-2" src={`./images/action.svg`} />
                Actions Required
              </>
            )}
          </div>
          <Chevron
            className="stroke-black h-4"
            direction={`${isOpen ? "up" : "down"}`}
          ></Chevron>
        </div>
      </div>
      <div
        className="px-6"
        ref={contentRef}
        style={{
          height: contentHeight === 'auto' ? 'auto' : `${contentHeight}px`,
          transition: 'height 0.3s ease-in-out',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;