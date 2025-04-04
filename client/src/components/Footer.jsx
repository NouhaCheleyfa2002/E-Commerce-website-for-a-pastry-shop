import React from 'react'
import { FaMapMarkerAlt, FaEnvelope, FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import logo2 from '../assets/img/logo2.png' 
import bg7 from '../assets/img/bg7.jpg'


const Footer = ()=>{
  return (
    <footer className="bg-[#f3e0c9] py-12 px-6 text-[#8B5E3C]" style={{
              backgroundImage: `url(${bg7})`,
              backgroundPosition: "top",
              backgroundSize: "85% auto",
             
            }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Welcome Message */}
        <div>
          <img src={logo2} alt="" />
          <p className="text-sm max-w-xs">
            Welcome to a world of flavor where every pastry is a masterpiece, where tradition meets taste. Welcome to Milanda Sweets.
          </p>
        </div>

        {/* Links */}
        
        <div >
          <h3 className="text-lg font-semibold mb-3">Milanda Sweets</h3>
          <ul className="space-y-2 text-sm">
            <li>Home</li>
            <li>Category</li>
            <li>Events</li>
            <li>About Us</li>
          </ul>
        </div>

        {/* Location */}
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Location</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><FaMapMarkerAlt /> Mahdia</li>
            <li className="flex items-center gap-2"><FaMapMarkerAlt /> Sousse</li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><FaEnvelope /> Email</li>
            <li className="flex items-center gap-2"><FaFacebookF /> Facebook</li>
            <li className="flex items-center gap-2"><FaInstagram /> Instagram</li>
            <li className="flex items-center gap-2"><FaTiktok /> Tiktok</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;