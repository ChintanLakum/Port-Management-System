import React from 'react';
import { FaCogs, FaChartLine, FaLock } from 'react-icons/fa';
import { MdOutlinePinDrop } from 'react-icons/md';
import { Link } from 'react-router-dom'; // Ensure this is imported

const servicesData = [
    {
        icon: <MdOutlinePinDrop className="text-4xl text-cyan-600" />,
        title: "Real-Time Vessel Tracking & Docking",
        description: "Know the exact location and status (Docked/In Route) of every vessel instantly. Our system minimizes waiting times and prevents capacity conflicts by providing live port visualization.",
        benefits: ["Live GPS location updates.", "Automated docking status changes.", "Visual port map integration."],
    },
    {
        icon: <FaCogs className="text-4xl text-cyan-600" />,
        title: "Optimized Capacity Management",
        description: "Maximize port throughput by intelligently managing available resources. Our system provides alerts when dock capacity is nearing its limit, preventing overbooking and operational bottlenecks.",
        benefits: ["Automatic capacity alerts.", "Reduced ship queuing time.", "Historical utilization reports."],
    },
    {
        icon: <FaChartLine className="text-4xl text-cyan-600" />,
        title: "Performance & Analytics Reporting",
        description: "Gain deep insights into port operations with comprehensive data analytics. Identify peak traffic times, measure docking efficiency, and forecast future resource needs.",
        benefits: ["Customizable performance dashboards.", "Efficiency metrics (turnaround time).", "Predictive resource forecasting."],
    },
    {
        icon: <FaLock className="text-4xl text-cyan-600" />,
        title: "Secure & Role-Based Access",
        description: "Ensure data integrity and security with granular user controls. Assign specific roles (Admin, Port Manager, System Admin) to manage access and permissions across the platform.",
        benefits: ["Multi-level user authorization.", "Secure login and data encryption.", "Audit logs for all critical actions."],
    },
];

const Services = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-base text-cyan-600 font-semibold tracking-wide uppercase">Our Solutions</h1>
                    <p className="mt-2 text-4xl leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none">
                        Essential Services for Modern Port Management
                    </p>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        We deliver the digital tools necessary to transform chaotic maritime operations into streamlined, efficient, and profitable systems.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {servicesData.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border-t-4 border-cyan-500"
                        >
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-100 mb-4">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                            <p className="text-gray-600 mb-6 text-sm">{service.description}</p>
                            
                            <h4 className="font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1">Key Benefits:</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {service.benefits.map((benefit, bIndex) => (
                                    <li key={bIndex} className="flex items-start">
                                        <svg className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                {/* CTA Section */}
                <div className="mt-20 text-center bg-cyan-500 p-10 rounded-xl shadow-2xl">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        Ready to Optimize Your Port Operations?
                    </h2>
                    <p className="mt-4 text-xl text-cyan-100">
                        Talk to our experts about customizing a solution that fits your exact needs.
                    </p>
                    <div className="mt-8 flex justify-center space-x-4">
                        <Link
                            to="/contact" // Client-side routing to Contact Us page
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-cyan-600 bg-white hover:bg-gray-100 shadow-lg transition duration-200"
                        >
                            Request a Demo
                        </Link>
                        <Link
                            to="/about" // Client-side routing to About Us page
                            className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-full text-white hover:bg-cyan-600 shadow-lg transition duration-200"
                        >
                            Learn About Our Technology
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Services;