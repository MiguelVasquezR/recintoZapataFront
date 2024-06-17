import React from "react";

import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
    return (
        <div className="bg-primary w-full text-secondary">
            <div className="py-2 flex flex-col gap-1">
                <h2 className="text-center">Redes Sociales</h2>
                <div className="flex flex-row gap-2 justify-center items-center">
                    <a target="_blank" href="https://www.facebook.com/profile.php?id=100069771084653"><FaFacebook size={30} /></a>
                    <a target="_blank" href="https://www.instagram.com/recinto.zapata/"><FaInstagram size={30} /></a>
                    <a target="_blank" href="https://www.tiktok.com/@recinto.zapata"><FaTiktok size={30} /></a>
                </div>
            </div>
        </div>
    )
}

export default Footer;