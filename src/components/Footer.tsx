import React from "react";

const Footer: React.FC = () => {
    return (
        <div className="flex bg-[#500000] text-white text-xs sm:text-sm sm:py-2 font-OpenSans">
            <div className="w-3/4 mx-auto flex flex-wrap justify-center items-center [&>a]:m-2">
                <a href="https://www.tamu.edu" target="_blank">© 2023 TEXAS A&M UNIVERSITY</a>
                <a href="https://it.tamu.edu/site-policies.php" target="_blank">SITE POLICIES</a>
                <a href="https://itaccessibility.tamu.edu/" target="_blank">WEB ACCESSIBILITY</a>
            </div>
        </div>
    )
}

export default Footer;