import { useState, useEffect, useMemo } from 'react';
import { toast } from "react-toastify";
import {
    FaBoxes,
    FaMapMarkerAlt,
    FaShip,
    FaTruckMoving,
    FaRegCheckCircle,
    FaGlobeAmericas,
    FaCheckCircle,
    FaTimesCircle,
} from 'react-icons/fa';
import { HiClock } from 'react-icons/hi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { ImSpinner9 } from 'react-icons/im';
import { useParams } from 'react-router-dom';

const IconMap = {
    Boxes: FaBoxes,
    MapMarker: FaMapMarkerAlt,
    Clock: HiClock,
    LocationMarker: HiOutlineLocationMarker,
    CheckCircleOutline: FaRegCheckCircle,
    CheckCircleSolid: FaCheckCircle,
    Ship: FaShip,
    Ship2: FaShip,
    TruckLoading: FaTruckMoving,
    Globe: FaGlobeAmericas,
    XCircle: FaTimesCircle,
    Spinner: ImSpinner9,
};
const Icon = ({ name, className }) => {
    const IconComponent = IconMap[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in IconMap.`);
        return null;
    }
    const iconClassName = name === 'Spinner'
        ? `${className} animate-spin`
        : className;

    return <IconComponent className={iconClassName} />;
};
const TIMELINE_STEPS = [
    { key: 'PENDING', title: 'Booking Confirmed', icon: 'CheckCircleOutline', color: 'text-cyan-600' },
    { key: 'DEPARTURED', title: 'Departed Port', icon: 'TruckLoading', color: 'text-cyan-600' },
    { key: 'IN ROUTE', title: 'In Transit', icon: 'Ship', color: 'text-cyan-600' },
    { key: 'ARRIVED', title: 'Arrived at Destination', icon: 'Globe', color: 'text-cyan-600' },
    { key: 'DELIVERED', title: 'Delivered to Consignee', icon: 'CheckCircleSolid', color: 'text-green-600' },
];

const getStatusStyles = (status) => {
    switch (status) {
        case 'ARRIVED':
            return { color: 'bg-green-100 text-green-700', icon: 'CheckCircleSolid', spinner: false };
        case 'IN ROUTE':
        case 'DEPARTURED':
            return { color: 'bg-cyan-100 text-cyan-700', icon: 'Ship2', spinner: true };
        case 'LOST':
            return { color: 'bg-red-100 text-red-700', icon: 'XCircle', spinner: false };
        case 'PENDING':
        default:
            return { color: 'bg-yellow-100 text-yellow-700', icon: 'Spinner', spinner: true };
    }
};

const OrderDetails = () => {

    const orderId = useParams();
    console.log(orderId.orderId)
    const [orderToRender, setOrderToRender] = useState({}
    );
    const [loading, setLoading] = useState(true);

   useEffect(() => {
  const fetchOrder = async () => {
    try {
      toast.loading("Fetching order details...", { toastId: "order-fetch" });

      const response = await fetch(`/api/order/${orderId.orderId}`);
      const data = await response.json();

      toast.dismiss("order-fetch");

      if (!response.ok) {
        toast.error(data.message || "Order not found");
        setLoading(false);
        return;
      }

      setOrderToRender(data.order);
      setLoading(false);

      // 🎯 Status-based toast
      switch (data.order.status) {
        case "DELIVERED":
          toast.success("Shipment delivered successfully 🎉");
          break;
        case "LOST":
          toast.error("Shipment marked as LOST. Please contact support 🚨");
          break;
        case "ARRIVED":
          toast.info("Shipment has arrived at destination port");
          break;
        case "IN ROUTE":
          toast.info("Shipment is currently in transit 🚢");
          break;
        default:
          toast.info("Order loaded successfully");
      }
    } catch (error) {
      toast.dismiss("order-fetch");
      toast.error("Failed to load order. Please try again later.");
      setLoading(false);
      console.error(error);
    }
  };

  fetchOrder();
}, [orderId.orderId]);


useEffect(() => {
  if (!orderToRender?.status) return;

  toast.info(`Status updated: ${orderToRender.status}`);
}, [orderToRender.status]);


    const sortedHistory = useMemo(() => {
        if (!orderToRender) return [];
        return [...(orderToRender.trackingHistory || [])].sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    }, [orderToRender]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="flex items-center text-xl font-semibold text-cyan-600 p-8 bg-white rounded-xl shadow-lg">
                    <Icon name="Spinner" className="h-6 w-6 mr-3" />
                    Loading Order Details...
                </div>
            </div>
        );
    }

    if (!orderToRender) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="text-xl font-semibold text-red-600 p-8 bg-white rounded-xl shadow-lg">
                    Order not found.
                </div>
            </div>
        )
    }

    const { color, icon: StatusIconName, spinner } = getStatusStyles(orderToRender.status);
    const lastUpdateTimestamp = sortedHistory.length > 0 ? sortedHistory[0].timestamp : orderToRender.updatedAt;

    let currentStepIndex = TIMELINE_STEPS.findIndex(step => step.key === orderToRender.status);
    if (currentStepIndex === -1 && orderToRender.status === 'ARRIVED') {
        currentStepIndex = 3;
    }
    const isLost = orderToRender.status === 'LOST';

    const formatTimestamp = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper to find history entry details for the current status (for the timeline pop-up detail)
    const findHistoryDetail = (statusKey) => {
        // Find the latest entry for this status
        return sortedHistory.slice().reverse().find(h => h.status === statusKey);
    };


    return (
        <div className="min-h-screen bg-gray-100 font-sans flex items-center justify-center p-4 sm:p-8">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-auto border border-cyan-100 overflow-hidden transform transition-all duration-300 hover:shadow-cyan-600/50">

                {/* HEADER SECTION (Top Bar) */}
                <div className="bg-cyan-700 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className='mb-4 sm:mb-0'>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">SHIPMENT TRACKING</h1>
                        <p className="text-lg font-medium opacity-90 mt-1">Order ID: **{orderToRender.order_id}**</p>
                    </div>

                    {/* STATUS BADGE */}
                    <div className={`px-5 py-2 rounded-full shadow-xl text-xl font-bold uppercase flex items-center ${color}`}>
                        {spinner && <Icon name="Spinner" className="h-5 w-5 mr-3" />}
                        {!spinner && <Icon name={StatusIconName} className="h-5 w-5 mr-3" />}
                        {orderToRender.status}
                    </div>
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: TRACKING TIMELINE (2/3 of space on large screens) */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 border-cyan-200 flex items-center">
                            <Icon name="LocationMarker" className="h-7 w-7 mr-3 text-cyan-600" />
                            Shipment Journey Timeline
                        </h2>

                        {/* Timeline */}
                        <div className="relative border-l-4 border-cyan-300 pl-6 space-y-12">

                            {isLost ? (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg">
                                    <h3 className="font-bold text-lg">Shipment Status: LOST</h3>
                                    <p>Please contact support immediately with your Order ID for resolution.</p>
                                </div>
                            ) : (
                                TIMELINE_STEPS.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;
                                    const isActive = index === currentStepIndex;
                                    const detail = findHistoryDetail(step.key);

                                    return (
                                        <div key={step.key} className="relative">
                                            {/* Circular Icon Marker */}
                                            <div className={`absolute -left-9 top-0 h-8 w-8 rounded-full flex items-center justify-center ${isCompleted
                                                ? (step.key === 'DELIVERED' ? 'bg-green-600' : 'bg-cyan-600')
                                                : 'bg-gray-300'
                                                } text-white shadow-md`}>
                                                {/* Use the CheckCircleOutline for completed steps, or the step's specific icon for the active/pending step */}
                                                {isCompleted && step.key !== 'DELIVERED' ?
                                                    <Icon name="CheckCircleOutline" className="h-4 w-4" />
                                                    : <Icon name={step.icon} className="h-4 w-4" />}
                                            </div>

                                            {/* Content Box */}
                                            <div className={`p-4 rounded-lg transition-all duration-300 ${isActive
                                                ? 'bg-cyan-50 border-2 border-cyan-400 shadow-lg'
                                                : isCompleted
                                                    ? 'bg-white border border-gray-100'
                                                    : 'bg-gray-50 text-gray-500'
                                                }`}>
                                                <h3 className={`font-extrabold text-lg ${isCompleted && !isActive ? 'text-gray-700' : 'text-cyan-800'}`}>
                                                    {step.title}
                                                </h3>
                                                {/* Details based on history */}
                                                {detail && (
                                                    <div className="mt-2 text-sm space-y-1">
                                                        <p className="flex items-center text-gray-600 font-medium">
                                                            <Icon name="Clock" className="h-4 w-4 mr-2" />
                                                            Time: {formatTimestamp(detail.timestamp)}
                                                        </p>
                                                        <p className="flex items-center text-gray-600 font-medium">
                                                            <Icon name="MapMarker" className="h-4 w-4 mr-2" />
                                                            Location: {detail.location}
                                                        </p>
                                                    </div>
                                                )}
                                                {!isCompleted && <p className="mt-2 text-sm">Awaiting status update.</p>}
                                                {isActive && orderToRender.current_port_name && (
                                                    <p className="mt-2 text-sm text-cyan-600 font-semibold">
                                                        Current Known Location: **{orderToRender.current_port_name}**
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SHIPMENT DETAILS (1/3 of space) */}
                    <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner space-y-6">

                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 border-cyan-200">
                            Order & Vessel Details
                        </h2>

                        {/* Detail Box: Route */}
                        <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <p className="font-bold text-sm text-gray-600 flex items-center uppercase">
                                <Icon name="MapMarker" className="h-4 w-4 mr-2 text-cyan-600" /> Origin to Destination
                            </p>
                            <p className="text-base font-semibold text-gray-800">
                                **{orderToRender.current_port_name}**
                                <span className="text-cyan-600 mx-2 text-xl font-black"> &#10140; </span>
                                **{orderToRender.destination_port_name}**
                            </p>
                        </div>

                        {/* Detail Box: Vessel */}
                        <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <p className="font-bold text-sm text-gray-600 flex items-center uppercase">
                                <Icon name="Ship" className="h-4 w-4 mr-2 text-cyan-600" /> Vessel & Ship ID
                            </p>
                            <p className="text-xl font-black text-cyan-700">{orderToRender.ship_name || 'Vessel Not Specified'}</p>
                            <p className="text-sm text-gray-500">Tracking ID: {orderToRender.ship_id}</p>
                        </div>

                        {/* Detail Box: Cargo */}
                        <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <p className="font-bold text-sm text-gray-600 flex items-center uppercase">
                                <Icon name="Boxes" className="h-4 w-4 mr-2 text-cyan-600" /> Cargo Volume
                            </p>
                            <p className="text-xl font-black text-gray-900">
                                **{orderToRender.storage}** <span className="text-cyan-700">{orderToRender.storage_unit}</span>
                            </p>
                        </div>

                        {/* Detail Box: Financial ID */}
                        <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <p className="font-bold text-sm text-gray-600 flex items-center uppercase">
                                <Icon name="Clock" className="h-4 w-4 mr-2 text-cyan-600" /> Payment Reference
                            </p>
                            <p className="text-base font-semibold text-gray-900">
                                {orderToRender.payment_id}
                            </p>
                        </div>

                        {/* Last Update Time */}
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 flex items-center">
                                <Icon name="Clock" className="h-4 w-4 mr-1" /> Data Last Updated: {formatTimestamp(lastUpdateTimestamp)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* FOOTER STRIP */}
                <div className="bg-cyan-50 p-4 text-center text-sm text-cyan-800 border-t border-cyan-200 font-medium">
                    Need further assistance? Contact our support team with your Order ID: **{orderToRender.order_id}**.
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;