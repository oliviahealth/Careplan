import React from 'react';
import { Link } from 'react-router-dom';

type BackPageProps = {
  children: React.ReactNode;
};

const BackPage: React.FC<BackPageProps> = ({ children }) => (
  <>
    <Link
      className="group absolute top-[6.25rem] left-[5.75rem] flex flex-row hover:text-black text-gray-500 items-center gap-4 transition-colors duration-200 ease-in-out"
      to={'/dashboard'}
    >
      <svg
        viewBox="0 0 15 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `rotate(180deg)` }}
        className={`h-7 stroke-gray-500 group-hover:stroke-black transition-colors duration-200 ease-in-out`}
      >
        <path
          d="M2 24L13 13L2 2"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </Link>
    {children}
  </>
);

export default BackPage;
