import React from "react";

const Footer: React.FC = () => {
    return (
        <div className="flex bg-[#500000] text-white md:text-xs text-[0.5rem] md:py-1 font-OpenSans">
            <div className="w-3/4 mx-auto flex justify-center items-center [&>a]:m-1 md:[&>a]:m-2">
                <a href="https://www.tamu.edu" target="_blank">© 2024 TEXAS A&M UNIVERSITY</a>
                <a href="https://it.tamu.edu/site-policies.php" target="_blank">SITE POLICIES</a>
                <a href="https://itaccessibility.tamu.edu/" target="_blank">WEB ACCESSIBILITY</a>
            </div>
        </div>
    )
}

export default Footer;