import React, { useEffect, useState } from "react";
import { TbWorld } from "react-icons/tb";
import { FaHandshake } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShip, FaUsers, FaWarehouse, FaClipboardList } from 'react-icons/fa';
import { FaPlusCircle, FaTruck, FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa';
import { IoSettingsSharp } from "react-icons/io5";

const Home = () => {
    const imageUrl = "../public/images/bgimage2.png";

    const navigate = useNavigate();
    const [error, setError] = useState();
    const [data, setdata] = useState({});
    const { isLoggedIn, isAdmin, isSystemAdmin, portId, userId } = useSelector(
        (state) => state.auth
    );

    let fetchUrl = `/api`;
    if (!isLoggedIn) {
        fetchUrl = "";
    } else if (isAdmin) {
        fetchUrl = `/api/port/${portId}`;
    } else if (isSystemAdmin) {
        fetchUrl = `/api/systemAdmin/systemStats`;
    }

    useEffect(() => {
        if (!fetchUrl) return;

        const fetchData = async () => {
            try {
                const response = await fetch(fetchUrl, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const dataToSet = await response.json();
                    if (isAdmin) {
                        setdata(dataToSet.port);
                    } else if (isSystemAdmin) {
                        setdata(dataToSet);
                    }
                } else {
                    throw new Error(`API returned status ${response.status}`);
                }
            } catch (err) {
                console.error("Failed to fetch initial data:", err);
                setError("Failed to load dashboard data. Please check connection.");
            }
        };
        fetchData();
    }, [fetchUrl, isAdmin, isSystemAdmin]);


    const LandingPage = () => (
        <>
            {/* Hero Section: Main container uses the background image */}
            <div
                className="relative bg-cover bg-center bg-no-repeat h-[70vh] flex items-center justify-center my-1 shadow-xl"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                {/* Dark Overlay for contrast (Crucial for text on image) */}
                <div className="absolute inset-0 bg-transparent opacity-60"></div>

                <div className="relative flex flex-col gap-y-6 items-center text-center p-4 z-10">
                    <p className="text-2xl sm:text-3xl md:text-4xl text-gray-800 font-extrabold tracking-tight drop-shadow-2xl">
                        Your Gateway to Seamless Global Logistics.
                    </p>
                    <p className="text-lg sm:text-xl text-gray-600 font-medium max-w-2xl drop-shadow-lg">
                        Connecting you to the world with real-time port management and unparalleled efficiency.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 lg:gap-10 mt-8 w-full">
                        <Link
                            to="/service"
                            className="bg-cyan-500 text-lg py-3 px-10 text-white w-3/5 md:w-auto rounded-full shadow-2xl hover:bg-cyan-600 transition duration-300 transform hover:scale-[1.03] font-semibold uppercase tracking-wider"
                        >
                            Explore Services
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-white text-lg py-3 px-10 text-cyan-700 w-3/5 md:w-auto rounded-full shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:scale-[1.03] font-semibold border-2 border-cyan-500 uppercase tracking-wider"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>

            {/* Value Proposition Section: Using a clean, light base for readability */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 white">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-12">
                    How Port-X Transforms Your Logistics
                </h2>

                <div className="flex flex-col md:flex-row justify-center max-w-6xl mx-auto gap-8 md:gap-12">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center text-center text-gray-700 p-8 rounded-xl shadow-2xl border-t-4 border-cyan-500 bg-white hover:shadow-3xl transition duration-300">
                        <div className="flex justify-center text-6xl text-cyan-600 mb-4 animate-pulse-once">
                            <TbWorld />
                        </div>
                        <p className="text-2xl font-bold mb-2">
                            Discover & Connect
                        </p>
                        <p className="text-base text-gray-600">
                            Connects you with a global network for seamless international trade and real-time vessel visibility.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-center text-center text-gray-700 p-8 rounded-xl shadow-2xl border-t-4 border-cyan-500 bg-white hover:shadow-3xl transition duration-300">
                        <div className="flex justify-center text-6xl text-cyan-600 mb-4 animate-pulse-once">
                            <LiaClipboardListSolid />
                        </div>
                        <p className="text-2xl font-bold mb-2">
                            Streamlined Operations
                        </p>
                        <p className="text-base text-gray-600">
                            Simplify daily tasks like cargo tracking, dock scheduling, and documentation with automated workflows.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-center text-center text-gray-700 p-8 rounded-xl shadow-2xl border-t-4 border-cyan-500 bg-white hover:shadow-3xl transition duration-300">
                        <div className="flex justify-center text-6xl text-cyan-600 mb-4 animate-pulse-once">
                            <FaHandshake />
                        </div>
                        <p className="text-2xl font-bold mb-2">
                            Secure Partnerships
                        </p>
                        <p className="text-base text-gray-600">
                            Fosters trusted relationships and transparent collaboration with all clients and maritime partners.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );

    const LoggedIn = () => (<>
        <div className="p-6 sm:p-8 lg:p-10 min-h-[85vh] bg-gray-50">
            {/* 1. Header: Personalized Welcome and Action Button */}
            <div className="flex justify-between items-center mb-8 bg-white backdrop-blur-sm p-4 rounded-xl shadow-2xl border-b-4 border-cyan-600">
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cyan-600">
                    Welcome back, <span className="text-cyan-600">{ }</span>!
                </p>
                <Link
                    to="/ports" // Link to the place where a new order is created
                    className="bg-green-600 text-sm py-2 px-4 sm:px-6 text-white rounded-lg shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 font-medium flex items-center space-x-2"
                >
                    <FaPlusCircle /> <span>Place New Order</span>
                </Link>
            </div>

            {/* 2. Stats Grid: Personal Order/Shipment Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                {/* Active Orders Card (Replaced 'Ships in Port') */}
                <div className="bg-white/95 p-6 rounded-xl shadow-2xl border-l-4 border-cyan-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-500 uppercase">Active Shipments</p>
                        <FaTruck className="text-2xl text-cyan-500" />
                    </div>
                    {/* Assuming userData has a field called active_orders_count */}
                    <p className="text-4xl font-extrabold text-gray-900 mt-2">{0}</p>
                </div>

                {/* Orders Delivered Card (Replaced 'Pending Orders') */}
                <div className="bg-white/95 p-6 rounded-xl shadow-2xl border-l-4 border-green-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-500 uppercase">Orders Delivered</p>
                        <FaClipboardList className="text-2xl text-green-500" />
                    </div>
                    {/* Assuming userData has a field called delivered_orders_count */}
                    <p className="text-4xl font-extrabold text-gray-900 mt-2">{0}</p>
                </div>

                {/* Pending Actions Card (Replaced 'Active Routes') */}
                <div className="bg-white/95 p-6 rounded-xl shadow-2xl border-l-4 border-indigo-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-500 uppercase">Pending Actions</p>
                        <FaMapMarkerAlt className="text-2xl text-indigo-500" />
                    </div>
                    {/* For things like incomplete forms, payment pending, etc. */}
                    <p className="text-4xl font-extrabold text-gray-900 mt-2">{0}</p>
                </div>

                {/* Saved Addresses Card (Replaced 'Port Capacity') */}
                <div className="bg-white/95 p-6 rounded-xl shadow-2xl border-l-4 border-orange-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-500 uppercase">Saved Addresses</p>
                        <FaWarehouse className="text-2xl text-orange-500" />
                    </div>
                    {/* For quick checkout/order placement */}
                    <p className="text-4xl font-extrabold text-gray-900 mt-2">{0}</p>
                </div>
            </div>

            {/* 3. Quick Action Links: Focused on Customer Tasks */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4 bg-white/70 p-2 rounded">Your Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Link to all orders/shipments */}
                <Link to={"/orders"} className="p-4 bg-white/95 rounded-xl shadow-lg text-center text-lg font-bold text-cyan-600 border-b-4 border-cyan-400 hover:bg-cyan-50 hover:shadow-xl transition duration-300 flex items-center justify-center space-x-3">
                    <FaClipboardList className="text-2xl" /> <span>View All Orders</span>
                </Link>
                {/* Link to customer support */}
                 <Link to={"/track"} className="p-4 bg-white/95 rounded-xl shadow-lg text-center text-lg font-bold text-green-600 border-b-4 border-green-400 hover:bg-green-50 hover:shadow-xl transition duration-300 flex items-center justify-center space-x-3">
                    <FaTruck className="text-2xl" /> <span>Track Shipment</span>
                </Link>
                {/* Link to update profile/details */}
                <Link to={`/profile/${userId}`} className="p-4 bg-white/95 rounded-xl shadow-lg text-center text-lg font-bold text-indigo-600 border-b-4 border-indigo-400 hover:bg-indigo-50 hover:shadow-xl transition duration-300 flex items-center justify-center space-x-3">
                    <FaUserCircle className="text-2xl" /> <span>Manage Profile</span>
                </Link>
            </div>
        </div>
    </>
    )

    const AdminDashboard = () => (
        <div className="p-6 sm:p-8 lg:p-10 min-h-[85vh]">
            <div className="flex justify-between items-center mb-8 bg-white backdrop-blur-sm p-4 rounded-xl shadow-2xl border-b-4 border-cyan-600">
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cyan-600">
                    {data.port_name || "Port Admin Dashboard"}
                </p>
                <Link
                    to="/orders"
                    className="bg-cyan-600 text-sm py-2 px-4 sm:px-6 text-white rounded-lg shadow-lg hover:bg-cyan-700 transition duration-300 transform hover:scale-105 font-medium flex items-center space-x-2"
                >
                    <FaClipboardList /> <span>View Orders</span>
                </Link>
            </div>

            {/* Stats Grid: Visually appealing cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                {/* Ship in Port Card */}
                <div className="bg-white/95 p-6 rounded-xl shadow-2xl border-l-4 border-cyan-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-500 uppercase">Ships in Port</p>
                        <FaShip className="text-2xl text-cyan-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-gray-900 mt-2">{data.available_ships || 0}</p>
                </div>

                {/* Orders Card */}
                <div className="bg-white/95 p-6 rounded-xl shadow-2xl border-l-4 border-green-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-500 uppercase">Pending Orders</p>
                        <FaClipboardList className="text-2xl text-green-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-gray-900 mt-2">--</p>
                </div>

                {/* Active Routes Card (Placeholder Data) */}
                <div className="bg-white/95 p-6 rounded-xl shadow-2xl border-l-4 border-indigo-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-500 uppercase">Active Routes</p>
                        <TbWorld className="text-2xl text-indigo-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-gray-900 mt-2">--</p>
                </div>

                {/* Port Capacity Card */}
                <div className="bg-white/95 p-6 rounded-xl shadow-2xl border-l-4 border-orange-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-500 uppercase">Total Capacity</p>
                        <FaWarehouse className="text-2xl text-orange-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-gray-900 mt-2">{data.total_docks || 0}</p>
                </div>
            </div>

            {/* Management Links: Clear, clickable buttons */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4 bg-white/70 p-2 rounded">Quick Management Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to={`/portDetails/${portId}`} className="p-4 bg-white/95 rounded-xl shadow-lg text-center text-lg font-bold text-indigo-600 border-b-4 border-indigo-400 hover:bg-indigo-50 hover:shadow-xl transition duration-300 flex items-center justify-center space-x-3">
                    <FaWarehouse className="text-2xl" /> <span>Manage Port</span>
                </Link>
                <Link to={"/ships"} className="p-4 bg-white/95 rounded-xl shadow-lg text-center text-lg font-bold text-cyan-600 border-b-4 border-cyan-400 hover:bg-cyan-50 hover:shadow-xl transition duration-300 flex items-center justify-center space-x-3">
                    <FaShip className="text-2xl" /> <span>View All Ships</span>
                </Link>
                
                <Link to={`/profile/${userId}`} className="p-4 bg-white/95 rounded-xl shadow-lg text-center text-lg font-bold text-green-600 border-b-4 border-green-400 hover:bg-green-50 hover:shadow-xl transition duration-300 flex items-center justify-center space-x-3">
                    <FaUserCircle className="text-2xl" /> <span>Manage Profile</span>
                </Link>
            </div>
        </div>
    );



    const SystemAdminDashboard = () => (
        <div className="p-6 sm:p-8 lg:p-10 min-h-[85vh]">
             <div className="flex justify-between items-center mb-8 bg-white backdrop-blur-sm p-4 rounded-xl shadow-2xl border-b-4 border-cyan-600">
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cyan-600">
                    System Admin Control Panel
                </p>
                <Link
                    to={`/profile/${userId}`}
                    className="bg-cyan-600 text-sm py-2 px-4 sm:px-6 text-white rounded-lg shadow-lg hover:bg-teal-600 transition duration-300 transform hover:scale-105 font-medium flex items-center space-x-2"
                >
                    <FaUserCircle className="text-2xl" /> <span>Manage Profile</span>
                </Link>
            </div>

            {/* Global Stats Grid: Using dark translucent cards for a high-tech look */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                {/* Total Ports Card */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-l-4 border-red-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-400 uppercase">Total Ports</p>
                        <FaWarehouse className="text-2xl text-red-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-black mt-2">{data.totalPorts || 0}</p>
                </div>

                {/* Total Users Card */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-l-4 border-yellow-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-400 uppercase">Total Users</p>
                        <FaUsers className="text-2xl text-yellow-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-black mt-2">{data.totalUsers || 0}</p>
                </div>

                {/* Total Ships Card */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-l-4 border-blue-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-400 uppercase">Total Ships</p>
                        <FaShip className="text-2xl text-blue-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-black mt-2">{data.totalShips || 0}</p>
                </div>

                {/* Orders Card (Placeholder Data) */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-l-4 border-green-500 transition duration-300 hover:shadow-3xl">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-400 uppercase">Total Orders</p>
                        <FaClipboardList className="text-2xl text-green-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-black mt-2">{data.totalOrders || 0}</p>
                </div>
            </div>

            {/* Management Links: Dark theme links */}
            <h3 className="text-xl font-semibold text-white mb-4 bg-gray-900/70 p-2 rounded">Global Management Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to={"/ports"} className="p-4 bg-white rounded-xl shadow-lg text-center text-lg font-bold text-red-400 border-b-4 border-red-500 hover:bg-red-50 hover:shadow-xl transition-transform duration-300 flex items-center justify-center space-x-3">
                    <FaWarehouse className="text-2xl" /> <span>Manage Ports</span>
                </Link>
                <Link to={"/ships"} className="p-4 bg-white rounded-xl shadow-lg text-center text-lg font-bold text-teal-400 border-b-4 border-teal-500 hover:bg-teal-50 hover:shadow-xl transition-transform duration-300 flex items-center justify-center space-x-3 hover:scale-105">
                    <FaShip className="text-2xl" /> <span>Manage Ships</span>
                </Link>
                
                <Link to={"/users"} className="p-4 bg-white rounded-xl shadow-lg text-center text-lg font-bold text-yellow-400 border-b-4 border-yellow-500 hover:bg-yellow-50 hover:shadow-xl transition-transform duration-300 flex items-center justify-center space-x-3">
                    <FaUsers className="text-2xl" /> <span>Manage Users</span>
                </Link>
            </div>
        </div>
    );



    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundImage: isLoggedIn ? `url(${imageUrl})` : 'none', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>

            {/* Conditional background wrapper for non-logged in users (handled in LandingPage) */}

            {/* Show Error Message if present */}
            {error && (
                <div className="bgwhite text-white border-l-4 border-red-300 p-4" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}


            {isLoggedIn && !isAdmin && !isSystemAdmin && <LoggedIn />}
            {!isLoggedIn && <LandingPage />}
            {isLoggedIn && isAdmin && !isSystemAdmin && <AdminDashboard />}
            {isLoggedIn && isSystemAdmin && !isAdmin && <SystemAdminDashboard />}
        </div>
    );
};

export default Home;