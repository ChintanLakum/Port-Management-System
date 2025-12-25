import { useNavigate } from "react-router-dom";
import { FaShip, FaMapMarkerAlt, FaRegCaretSquareRight, FaBoxes } from 'react-icons/fa';
import { useState } from "react";
import { toast } from "react-toastify";


const OrderCard = (order) => {
    const navigate = useNavigate();
    const [orderToRender, setOrderToRender] = useState(order.order)
    const orderId = order.order.order_id;

    const handleCardClick = () => {
        if (!orderId) {
            toast.error("Invalid order. Unable to track.");
            return;
        }

        toast.info(`Tracking order ${orderId}`, {
            autoClose: 1200,
        });

        navigate(`/track/${orderId}`);
    };

    return (
        <div
            className="bg-white rounded-xl border border-gray-100 shadow-xl w-full sm:max-w-sm lg:max-w-md mx-auto m-4 flex flex-col transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/50 cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Content area */}
            <div className="p-6 flex flex-col justify-between flex-grow">

                {/* Header Section: ID, User ID, and Status */}
                <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
                    <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-3xl font-black text-gray-800 truncate tracking-tight">{orderToRender.order_id}</h3>
                        <h3 className="text-xs font-medium text-gray-500 uppercase mt-1">User ID: <span className="text-gray-700 font-semibold"> {orderToRender.user_id}</span></h3>
                    </div>

                    {/* Status Badge */}
                    <span className="inline-block flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-md bg-cyan-600 text-white">
                        {orderToRender.status || "PENDING"}
                    </span>

                </div>

                {/* Main Details Section */}
                <div className="space-y-3 text-sm text-gray-700">

                    {/* Ship ID */}
                    <p className="flex justify-between items-center p-2 bg-cyan-50/50 rounded-lg">
                        <span className="font-bold text-cyan-700 flex items-center">
                            {/* REACT ICON for Ship */}
                            <FaShip className="h-4 w-4 mr-2" />
                            Ship ID
                        </span>
                        <span className="font-extrabold text-gray-900 text-base">{orderToRender.ship_id}</span>
                    </p>

                    {/* Current Port */}
                    <p className="flex justify-between items-center p-2 border-b border-dashed border-gray-200">
                        <span className="font-medium text-gray-600 flex items-center">
                            {/* REACT ICON for Current Port */}
                            <FaMapMarkerAlt className="h-4 w-4 mr-2 text-green-600" />
                            Current Port:
                        </span>
                        <span className="font-semibold text-gray-800">{orderToRender.current_port_name}</span>
                    </p>

                    {/* Destination Port */}
                    <p className="flex justify-between items-center p-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600 flex items-center">
                            {/* REACT ICON for Destination Port */}
                            <FaRegCaretSquareRight className="h-4 w-4 mr-2 text-red-600" />
                            Destination Port:
                        </span>
                        <span className="font-semibold text-gray-800">{orderToRender.destination_port_name}</span>
                    </p>

                    {/* Storage */}
                    <p className="flex justify-between items-center pt-3 border-t-2 border-dashed border-cyan-200">
                        <span className="font-extrabold text-gray-700 text-base flex items-center">
                            {/* REACT ICON for Storage */}
                            <FaBoxes className="h-5 w-5 mr-2 text-cyan-600" />
                            Total Storage
                        </span>
                        <span className="font-black text-xl text-cyan-600">{orderToRender.storage} <span className="text-lg font-bold text-cyan-700">{orderToRender.storage_unit}</span></span>
                    </p>

                </div>
            </div>
        </div>
    );
};


export default OrderCard;