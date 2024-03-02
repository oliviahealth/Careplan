import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className="flex min-h-[6.25rem] w-full items-center text-black border-b shadow-xl">
      <div className="flex min-w-[60rem] px-4 mx-auto items-center justify-between">
        <div>
          <Link to={"/"}>
            <img className="h-auto" src="/images/pageone.svg"></img>
          </Link>
        </div>
        <div className="space-x-10">
          <Link to={"/"}>
            Client Dashboard
          </Link>
          <Link to={"/"} className="button">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
