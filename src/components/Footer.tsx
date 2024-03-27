import React from "react";

const Footer: React.FC = () => {
    return (
        <div className="flex min-h-auto bg-[#500000] text-white text-[.75rem] md:text-sm font-OpenSans">
            <div className="w-7/8 md:w-3/4 mx-auto flex justify-center items-center gap-4 p-3">
                <a href="https://www.tamu.edu" target="_blank">© 2024 TEXAS A&M UNIVERSITY</a>
                <a href="https://it.tamu.edu/site-policies.php" target="_blank">SITE POLICIES</a>
                <a href="https://itaccessibility.tamu.edu/" target="_blank">WEB ACCESSIBILITY</a>
            </div>
        </div>
    )
}

export default Footer;