import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return(
    <>
    <Navbar/>
    <div className="flex h-screen overflow-hidden bg-[url('./images/background.png')] bg-cover justify-center items-center">
      <img className="w-[50rem]" src="/images/oliviahealth.svg" style={{filter: "brightness(0) invert(1)"}}></img>
    </div>
    <Footer/>
    </>
  );
};

export default Layout;