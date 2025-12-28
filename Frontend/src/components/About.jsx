import React from 'react';
// Removed FaCogs and FaChartLine as they aren't used in the core values section below,
// but kept the ones needed for the Mission/Vision or values.
import { FaShip, FaCheckCircle, FaChartLine } from 'react-icons/fa'; 
import { IoDiamondOutline } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";
import { Link } from 'react-router-dom';


const AboutUs = () => {
    // Replace with your actual team members if you have them, or keep generic for now
    const teamMembers = [
        {
            name: "Jane Doe",
            title: "Founder & CEO",
            // CORRECTED: "15 years experience" -> "15 years' experience" or "15 years of experience"
            bio: "A seasoned maritime logistics expert with over 15 years' experience in port operations and supply chain optimization.",
            image: "https://via.placeholder.com/150/F87171/FFFFFF?text=Jane", // Placeholder image
        },
        {
            name: "John Smith",
            title: "Lead Solutions Architect",
            bio: "Driving the technical vision, John is an expert in real-time data systems and scalable cloud infrastructure.",
            image: "https://via.placeholder.com/150/60A5FA/FFFFFF?text=John", // Placeholder image
        },
        // You can add a team section here later using the teamMembers array
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section: Mission & Vision */}
                <div className="text-center mb-16">
                    <h1 className="text-base text-cyan-600 font-semibold tracking-wide uppercase">Who We Are</h1>
                    <p className="mt-2 text-4xl leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none">
                        Innovating the Future of Port Management
                    </p>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        At <span className="text-cyan-600 font-bold">Port-X Solutions</span>, we are dedicated to transforming maritime logistics through cutting-edge digital platforms.
                    </p>
                </div>

                {/* Mission & Vision Statements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-cyan-500">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <FaShip className="mr-3 text-cyan-600" /> Our Mission
                        </h3>
                        <p className="text-lg text-gray-700">
                            To empower global ports with real-time data and intelligent automation, transforming operational complexities into strategic efficiencies and sustainable growth.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-emerald-500">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            {/* Re-using FaChartLine for vision, representing growth/future */}
                            <FaChartLine className="mr-3 text-emerald-600" /> Our Vision
                        </h3>
                        <p className="text-lg text-gray-700">
                            To be the leading technology partner, defining the future of intelligent, connected, and fully optimized maritime ecosystems worldwide.
                        </p>
                    </div>
                </div>

                {/* Our Story Section */}
                <div className="bg-white p-10 rounded-lg shadow-xl mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Our Journey</h2>
                    <div className="max-w-4xl mx-auto text-lg text-gray-700 space-y-6">
                        <p>
                            Born from the firsthand challenges of traditional port operations, Port-X Solutions was founded in 2023 with **a** clear objective: to revolutionize how ports manage their most critical assets – their ships and their space. We witnessed the inefficiencies, the manual errors, and the frustrating delays that plagued the industry.
                        </p>
                        <p>
                            Leveraging modern web technologies like React, Node.js, and robust Mongoose transactions, we engineered **a** platform that brings real-time visibility, intelligent automation, and unparalleled data integrity to port managers and system administrators. Our journey is one of continuous innovation, driven by **a** passion to deliver solutions that are not just functional, but transformative.
                        </p>
                    </div>
                </div>

                {/* Our Values Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border-b-4 border-indigo-500">
                            <MdOutlineSecurity className="text-5xl text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrity</h3>
                            <p className="text-gray-600 text-sm">Upholding the highest standards of data accuracy and ethical conduct in all our operations.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border-b-4 border-purple-500">
                            <IoDiamondOutline className="text-5xl text-purple-600 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
                            <p className="text-gray-600 text-sm">Constantly evolving our technology to meet the future demands of maritime logistics.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border-b-4 border-teal-500">
                            <FaCheckCircle className="text-5xl text-teal-600 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliability</h3>
                            <p className="text-gray-600 text-sm">Delivering robust, 24/7 dependable systems that ports can always count on.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border-b-4 border-orange-500">
                            <RiCustomerService2Line className="text-5xl text-orange-600 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Focus</h3>
                            <p className="text-gray-600 text-sm">Building solutions and partnerships that prioritize the unique needs and success of our clients.</p>
                        </div>
                    </div>
                </div>


                {/* Our Technology / USP Section */}
                <div className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white p-10 rounded-xl shadow-2xl mb-16">
                    <h2 className="text-3xl font-extrabold text-center mb-8">Our Technological Edge</h2>
                    <div className="max-w-4xl mx-auto text-lg space-y-4">
                        <p>
                            At the heart of Port-X Solutions lies **a** powerful, resilient, and modern tech stack. We leverage **Node.js with Express.js** for **a** fast, scalable backend, and **React.js with Tailwind CSS** for **a** responsive, intuitive frontend.
                        </p>
                        <p className="font-semibold text-xl">
                            <span className="text-yellow-300">Our USP:</span> Unwavering Data Integrity.
                            Our system utilizes advanced **Mongoose Transactions** to ensure that every docking and undocking operation is atomic. This guarantees real-time consistency, eliminating data conflicts and providing **a** single source of truth for your port's status.
                        </p>
                    </div>
                </div>

                {/* Call to Action Section (Crucial!) */}
                <div className="mt-20 text-center bg-gray-200 p-10 rounded-xl shadow-inner">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Join Us in Shaping the Future of Maritime Logistics
                    </h2>
                    <p className="mt-4 text-xl text-gray-700">
                        Ready to experience seamless port operations? Connect with our team today.
                    </p>
                    <div className="mt-8 flex justify-center space-x-4">
                        <Link
                            to="/contact" // Link to your Contact Us page
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-cyan-600 hover:bg-cyan-700 shadow-lg transition duration-200"
                        >
                            Contact Us
                        </Link>
                        <Link
                            // CORRECTED: Assuming your services page route is '/services', not '/service'
                            to="/services" 
                            className="inline-flex items-center justify-center px-8 py-3 border border-gray-400 text-base font-medium rounded-full text-gray-800 bg-white hover:bg-gray-100 shadow-lg transition duration-200"
                        >
                            Explore Our Services
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;