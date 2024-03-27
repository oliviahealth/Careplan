import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setOpen] = useState(false);

  const menuToggle = () => {
    setOpen(!isOpen);
  }

  return (
    <div className="flex min-h-[4.5rem] w-full items-center text-black border-b shadow-xl">
      <div className="flex w-full md:w-3/4 px-4 mx-auto items-center justify-between">
        <div>
          <Link to={"/"}>
            <img className="h-[3rem]" alt="Olivia Health Plan of Safecare logo" src="/images/pageone.svg"></img>
          </Link>
        </div>

        <div>
        <div className="md:hidden selectable group"onClick={menuToggle}>
          <div className="space-y-2">
            <span className="block h-1 w-8 bg-black rounded-full"></span>
            <span className="block h-1 w-8 bg-black rounded-full"></span>
            <span className={`block h-1 w-4 bg-black rounded-full transition-all duration-200 ease-out group-hover:w-8 ${isOpen ? "w-8" : ""}`}></span>
          </div>
        </div>
        <div className={`${isOpen ? "block bg-white border shadow mt-4 mr-1" : "hidden"} absolute rounded-xl md:shadow-none md:bg-none md:border-0 md:relative right-0 md:mt-0 p-4 md:p-0 md:flex space-y-6 md:space-y-0 md:space-x-4 text-sm md:text-base`}> 
          <Link to={"/"} className="block md:flex button">
            Client Dashboard
          </Link>
          <Link to={"/"} className="block md:flex button md:button-filled">
            Sign In
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
