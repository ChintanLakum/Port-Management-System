import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTrash } from "react-icons/fa";
import { AiOutlineForm } from "react-icons/ai";
import Message from './Message';
import Ships from './Ships';

const PortDetails = () => {
    const { portId } = useParams();
    const [port, setPort] = useState({});
    const [error, setError] = useState(null);
    const [img_url, setImageUrl] = useState(null);
    const [message, setMessage] = useState(null);
    const BACKEND_BASE_URL = 'http://localhost:5000';
    const navigate = useNavigate();
    const { isAdmin, isSystemAdmin, isLoggedIn } = useSelector(
        (state) => state.auth
    );
    useEffect(() => {
        if (portId) {
            fetchPort();
        }
    }, [portId]);
    const fetchPort = async () => {
        try {
            const response = await fetch(`/api/port/${portId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Port Found:", data);
                setPort(data.port)
                setImageUrl(`${BACKEND_BASE_URL}${data.port.img_url}`);

            }

            else {
                console.log(img_url)
                throw new Error("API did not return port with Port Id." + portId)
            }
        } catch (err) {
            console.error("Failed to fetch ports:", err);
            setError("Failed to load ports. Please try again later.");
        } finally {
            console.log("Port Fetched");
        }
    };

    const handleUpdatePort = (port) => {
        navigate(`/updatePort/${port.port_id}`, {
            state: {
                port: port
            }
        })
    }
        const handleRemovePort = async () => {
            if (!window.confirm(`Are you sure you want to permanently delete port ${portId}?`)) {
                return;
            }
            try {
                const responce = await fetch(`/api/port/${portId}`,
                    {
                        method: "DELETE",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });
                if (responce.ok) {
                    if (responce.status === 204) {
                        console.log(`Port ${portId} deleted successfully (204 No Content).`);
                        setTimeout(() => setMessage("Redirecting to Home Page "), 1000);
                        setTimeout(() => navigate("/"), 1400);
                        setError(null)
                    } else {
                        const data = await responce.json();
                        console.log(`Port ${portId} deleted successfully.`, data);
                    }

                }
                else if (responce.status === 404) {
                    console.error(`Error: Port ${portId} not found.`);

                } else {
                    const errorData = await responce.text();
                    console.error("Failed to delete port:", errorData.message || responce.statusText);
                }
            } catch (error) {
                console.error("Network error during port deletion:", error);

            }
            finally {
                console.log("Port removal attempt finished.");
            }
        }


        if (Object.keys(port).length === 0 && !error) {
            return (
                <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
                    <p className="ml-4 text-gray-700 text-lg font-medium">Loading Port Details...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex justify-center items-center h-screen bg-red-50 p-4">
                    <div className="p-6 bg-white rounded-xl shadow-xl border-t-4 border-red-500 max-w-lg w-full text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h2>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            );
        }


        return (

            <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center justify-start font-sans">
                {(message || error) && <Message message={message} error={error} />}

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl mx-auto mt-8 mb-12 transform transition duration-300 ease-in-out border border-gray-100" >
                    <img
                        src={img_url}
                        alt={port.port_name}
                        className="w-full h-96 md:h-[500px] object-cover rounded-t-3xl shadow-inner" // Increased height
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/1500x600/0891b2/ffffff?text=Port+Image+Missing";
                        }}
                    />

                    <div className="p-12 flex flex-col justify-between flex-grow">
                        <div className="flex justify-between items-start mb-10 border-b-2 pb-6 border-cyan-100">
                            <div className="flex-1 min-w-0 pr-8">
                                <h3 className="text-6xl md:text-7xl font-extrabold text-cyan-800 mb-2 leading-tight">{port.port_name}</h3>
                                <h3 className="text-2xl font-medium text-gray-500 tracking-wider">Admin ID: {port.port_id}</h3>
                            </div>
                            <div className="flex flex-col items-end space-y-3">
                                <span className={`inline-block px-5 py-2 rounded-full text-xl font-bold text-white shadow-lg whitespace-nowrap self-center ${port.status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'}`}>
                                    {port.status}
                                </span>

                                {/* NEW: Update Port Button for Port Admin */}
                                {isAdmin && (
                                    <button
                                        onClick={()=>handleUpdatePort(port)}
                                        className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 text-white font-bold rounded-xl shadow-md hover:bg-cyan-700 transition duration-150 ease-in-out transform hover:scale-105"
                                    >
                                        <AiOutlineForm />
                                        <span>Update Port</span>
                                    </button>
                                )}

                                {isSystemAdmin && (
                                    <button
                                        onClick={handleRemovePort}
                                        className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-md hover:bg-red-600 transition duration-150 ease-in-out transform hover:scale-105"
                                    >
                                        <FaTrash />
                                        <span>Remove Port</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-2xl text-cyan-700">
                            <p className="flex flex-col items-start bg-cyan-50 p-6 rounded-xl border border-cyan-100 shadow-sm">
                                <span className="text-xl text-gray-600 font-medium mb-1">City</span>
                                <span className="font-bold text-cyan-800">{port.city}</span>
                            </p>
                            <p className="flex flex-col items-start bg-cyan-50 p-6 rounded-xl border border-cyan-100 shadow-sm">
                                <span className="text-xl text-gray-600 font-medium mb-1">Available Docks</span>
                                <span className="font-bold text-cyan-800">{port.total_docks - port.available_ships}</span>
                            </p>
                            <p className="flex flex-col items-start bg-cyan-50 p-6 rounded-xl border border-cyan-100 shadow-sm">
                                <span className="text-xl text-gray-600 font-medium mb-1">Total Capacity</span>
                                <span className="font-bold text-cyan-800">{port.total_docks}</span>
                            </p>
                            <p className="flex flex-col items-start bg-cyan-50 p-6 rounded-xl border border-cyan-100 shadow-sm">
                                <span className="text-xl text-gray-600 font-medium mb-1">Ships Docked</span>
                                <span className="font-bold text-cyan-800">{port.available_ships}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {isLoggedIn && !isAdmin &&  !isSystemAdmin && (
                    <Ships portId={portId}/>
                )}
            </div>
        )
    }
    export default PortDetails;