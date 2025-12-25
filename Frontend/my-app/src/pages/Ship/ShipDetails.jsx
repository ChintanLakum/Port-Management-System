import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTrash } from "react-icons/fa";
import { AiOutlineForm } from "react-icons/ai";
import { SlAnchor } from "react-icons/sl";
import { FaAnchorCircleXmark, } from "react-icons/fa6";
import { FaPlusCircle } from 'react-icons/fa';
import Message from '../../components/Message';
import Orders from "../Order/Orders";
import { toast } from 'react-toastify';

const ShipDetails = () => {
    const { shipId } = useParams();
    const navigate = useNavigate();
    const [ship, setShip] = useState({});
    const [error, setError] = useState(null);
    const [img_url, setImageUrl] = useState(null);
    const [message, setMessage] = useState(null);
    const BACKEND_BASE_URL = 'http://localhost:5000';
    const { isAdmin, portId, isSystemAdmin, isLoggedIn } = useSelector(
        (state) => state.auth
    );
    useEffect(() => {
        if (shipId) {
            fetchShip();
        }
    }, [shipId]);

    const fetchShip = async () => {
        try {
            const response = await fetch(`/api/ship/${shipId}`, {
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setShip(data.ship);
                setImageUrl(
                    data.ship.img_url
                        ? `${BACKEND_BASE_URL}${data.ship.img_url}`
                        : null
                );
            } else {
                toast.error(data.message);
                setError(data.message);
            }
        } catch (error) {
            toast.error("Failed to load ship details");
            setError("Failed to load ship details");
        }
    };


    const handlePlaceOrder = (ship) => {
        console.log(ship)
        navigate("/placeOrder", {
            state: {
                ship: ship,
            }
        });
    }



    const handleUpdateShip = (ship) => {
        navigate(`/updateShip/${ship.ship_id}`, {
            state: {
                ship: ship
            }
        });
    };

    const handleDockShip = async () => {
        if (!window.confirm(`Are you sure you want to dock ship ${shipId}?`)) return;

        try {
            const response = await fetch(`/api/ship/dockShip/${portId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ shipId: ship.ship_id }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setTimeout(() => navigate("/ships"), 1500);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Network error while docking ship");
        }
    };

    const handleUndockShip = async () => {
        if (!window.confirm(`Are you sure you want to undock ship ${shipId}?`)) return;

        try {
            const response = await fetch(`/api/ship/unDockShip/${portId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ shipId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setTimeout(() => navigate("/ships"), 1500);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Network error while undocking ship");
        }
    };

    const handleRemoveShip = async () => {
        if (!window.confirm(`Are you sure you want to remove ship ${shipId}?`)) return;

        try {
            const response = await fetch(`/api/ship/${shipId}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setTimeout(() => navigate("/ships"), 1500);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Network error while deleting ship");
        }
    };


    if (Object.keys(ship).length === 0 && !error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
                <p className="ml-4 text-gray-700 text-lg font-medium">Loading Ship Details...</p>
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
        <div className="min-h-screen p-4 sm:p-8 bg-gray-100 flex flex-col items-center justify-start font-sans">
            {(message || error) && <Message message={message} error={error} />}
            <div className="bg-white rounded-3xl shadow-2xl shadow-cyan-300/30 overflow-hidden w-full max-w-7xl mx-auto mt-8 mb-12 transform transition duration-500 ease-in-out hover:shadow-cyan-500/40" >
                {/* Image Section */}
                <img
                    src={img_url}
                    alt={ship.ship_name}
                    className="w-full h-64 md:h-96 object-cover rounded-t-3xl border-b-4 border-cyan-500"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/1500x400/0891b2/ffffff?text=Ship+Image+Missing";
                    }}
                />

                <div className="p-6 md:p-12 flex flex-col justify-between flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b pb-6 border-gray-100">
                        {/* Name and ID */}
                        <div className="flex-1 min-w-0 pr-0 sm:pr-8 mb-4 sm:mb-0">
                            <h3 className="text-5xl md:text-6xl font-extrabold text-cyan-800 mb-2 leading-tight">{ship.ship_name}</h3>
                            <p className="text-xl font-medium text-gray-500 tracking-wider">Ship ID: <span className="text-gray-700 font-semibold">{ship.ship_id}</span></p>
                        </div>

                        {/* Status and Action Buttons */}
                        <div className="flex flex-col items-start sm:items-end space-y-3 flex-shrink-0">
                            <span className={`inline-block px-5 py-2 rounded-full text-lg font-bold uppercase text-white shadow-xl whitespace-nowrap self-start sm:self-end ${ship.status && (ship.status.toUpperCase().includes('DOCKED') || ship.status.toUpperCase().includes('IN ROUTE')) ? 'bg-green-600' : 'bg-red-600'}`}>
                                {ship.status}
                            </span>

                            {/* Update Ship Button for Ship Admin */}
                            {isAdmin && ship.status == "DOCKED" && (
                                <button
                                    onClick={() => handleUpdateShip(ship)}
                                    className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 text-white font-bold rounded-full shadow-lg hover:bg-cyan-700 transition duration-200 ease-in-out transform hover:scale-105"
                                >

                                    <AiOutlineForm />
                                    <span>Update Ship</span>
                                </button>
                            )}

                            {isLoggedIn && !isAdmin && (ship.remain_storage_capacity > 0) && (
                                <button
                                    onClick={() => handlePlaceOrder(ship)}
                                    className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 text-white font-bold rounded-full shadow-lg hover:bg-cyan-700 transition duration-200 ease-in-out transform hover:scale-105"
                                >

                                    <FaPlusCircle />
                                    <span>Place Order</span>
                                </button>
                            )}

                            {isSystemAdmin && (
                                <button
                                    onClick={() => handleRemoveShip()}
                                    className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white font-bold rounded-full shadow-lg hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105"
                                >
                                    <FaTrash />
                                    <span>Remove Ship</span>
                                </button>
                            )}



                            {/* Undock Ship Button for System Admin */}
                            {isAdmin && ship.status == "DOCKED" && (
                                <button
                                    onClick={handleUndockShip}
                                    className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white font-bold rounded-full shadow-lg hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105"
                                >
                                    <FaAnchorCircleXmark />
                                    <span>Undock Ship</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Ship Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xl">
                        {/* Detail Card 1: Current Port Name */}
                        <div className="flex flex-col items-start bg-white p-6 rounded-xl border border-gray-200 shadow-md transition duration-200 hover:shadow-cyan-200/50 hover:border-cyan-400">
                            <span className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-widest">Current Port Name</span>
                            <span className="font-extrabold text-2xl text-cyan-800">{ship.current_port_name}</span>
                        </div>

                        {/* Detail Card 2: Remaining Storage Capacity */}
                        <div className="flex flex-col items-start bg-white p-6 rounded-xl border border-gray-200 shadow-md transition duration-200 hover:shadow-cyan-200/50 hover:border-cyan-400">
                            <span className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-widest">Remaining Capacity</span>
                            <span className="font-extrabold text-2xl text-cyan-800">{ship.remain_storage_capacity} <span className="text-lg font-bold text-gray-600">{ship.storage_unit}</span></span>
                        </div>
                        {/* Detail Card 3: Total Capacity */}
                        <div className="flex flex-col items-start bg-white p-6 rounded-xl border border-gray-200 shadow-md transition duration-200 hover:shadow-cyan-200/50 hover:border-cyan-400">
                            <span className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-widest">Total Capacity</span>
                            <span className="font-extrabold text-2xl text-cyan-800">{ship.max_storage_capacity} <span className="text-lg font-bold text-gray-600">{ship.storage_unit}</span></span>
                        </div>

                        {/* Detail Card 4: Ship Type (Using ship.ship_type for display) */}
                        <div className="flex flex-col items-start bg-white p-6 rounded-xl border border-gray-200 shadow-md transition duration-200 hover:shadow-cyan-200/50 hover:border-cyan-400">
                            <span className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-widest">Ship Type</span>
                            <span className="font-extrabold text-2xl text-cyan-800">{ship.ship_type}</span>
                        </div>
                    </div>

                    {isAdmin && ship.status === "IN ROUTE" && (
                        <div className='flex justify-center'>
                            <button
                                onClick={() => handleDockShip()}
                                className="w-1/2 flex items-center justify-center space-x-2 px-6 py-3 bg-cyan-600 mt-6 text-white font-bold rounded-full shadow-lg hover:bg-cyan-700 transition duration-200 ease-in-out transform hover:scale-105"
                            >
                                <SlAnchor />
                                <span>Dock Ship Here</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {isLoggedIn && isAdmin && !isSystemAdmin && (
                <Orders ship={ship.ship_id} />
            )}
        </div>
    )
}

export default ShipDetails;