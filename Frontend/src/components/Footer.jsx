import { GrInstagram } from "react-icons/gr";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { BsYoutube } from "react-icons/bs";
import { GrLinkedin } from "react-icons/gr";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="bg-gray-800 text-white py-8 px-4 md:py-12 md:px-8 rounded-t-3xl">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Company Description and Logo */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="text-3xl font-bold text-white mb-2">PMS</div>
                    <p className="text-gray-400 text-sm">
                        Providing seamless and efficient port management solutions for a connected world.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="text-center md:text-left">
                    <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300">Home</Link></li>
                        <li><Link to="/service" className="text-gray-400 hover:text-white transition-colors duration-300">Services</Link></li>
                        <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</Link></li>
                        <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</Link></li>
                    </ul>
                </div>

                {/* Contact Information */}
                <div className="text-center md:text-left">
                    <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>Goverment Engineering college</li>
                        <li>Mavdi-Kankot Road Dholadhar</li>
                        <li>Rajkot Gujarat 360005</li>
                        <li><Link to="" className="hover:text-white transition-colors duration-300">7845454000</Link></li>
                        <li><Link to="" className="hover:text-white transition-colors duration-300">xyz@gmail.com</Link ></li>
                    </ul>
                </div>
                <div className="text-center md:text-left">
                    <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                    <div className="flex justify-center md:justify-start space-x-4">
                        <FaFacebookSquare />
                        <FaTwitter />
                        <GrLinkedin />
                        <BsYoutube />
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-6 pt-2 text-center text-sm text-gray-500">
                © 2025 Port-X. All Rights Reserved.
            </div>
        </div>)
}
export default Footer;      