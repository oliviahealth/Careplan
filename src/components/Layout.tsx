import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";


const Layout = () => {
  return (
    <div className="flex flex-col h-[100vh]">
      <Navbar />
        <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
