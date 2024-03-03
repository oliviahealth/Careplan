import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setOpen] = useState(false);

  const menuToggle = () => {
    setOpen(!isOpen);
  }

  return (
    <div className="flex min-h-[6.25rem] w-full items-center text-black border-b shadow-xl">
      <div className="flex w-[60rem] px-4 mx-auto items-center justify-between">
        <div>
          <Link to={"/"}>
            <img className="h-auto" src="/images/pageone.svg"></img>
          </Link>
        </div>

        <div>
        <div className={`md:hidden`} onClick={menuToggle}>
          <div className="space-y-2">
            <span className="block h-1 w-8 bg-black"></span>
            <span className="block h-1 w-8 bg-black"></span>
            <span className="block h-1 w-8 bg-black"></span>
          </div>
        </div>
        <div className={`${isOpen ? "block bg-white border" : "hidden"} absolute md:relative right-0 md:mt-0 p-5 md:p-0 md:flex space-y-6 md:space-y-0 md:space-x-4`}>
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
