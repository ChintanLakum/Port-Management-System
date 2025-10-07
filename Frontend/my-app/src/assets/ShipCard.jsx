import { useNavigate } from "react-router-dom";

const ShipCard = (ship) => {
    const navigate = useNavigate();
    const shipId = ship.ship.ship_id;
    const shipName = ship.ship.ship_name;
    const shipType = ship.ship.ship_type;
    const maxStorageCapacity = ship.ship.max_storage_capacity;
    const remain_storage_capacity = ship.ship.remain_storage_capacity;
    const storageUnit = ship.ship.storage_unit;
    const status = ship.ship.status;
    const currentPortId = ship.ship.current_port_id;
    const currentPortName = ship.ship.current_port_name;
    const lastPortId = ship.ship.last_port_id;
    const lastPortName = ship.ship.last_port_name;
    const destinationPortId = ship.ship.destination_port_id;
    const destinationPortName = ship.ship.destination_port_name;
    const relativeImgUrl = ship.ship.img_url;
    const BACKEND_BASE_URL = 'http://localhost:5000';
    const fullImgUrl = `${BACKEND_BASE_URL}${relativeImgUrl}`;
    return (
        <div
            className="bg-white rounded-xl shadow-2xl w-full sm:max-w-sm lg:max-w-md mx-auto m-4 flex flex-col transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-cyan-600/70 cursor-pointer"
            onClick={() => navigate(`/shipDetails/${shipId}`)}
        >
            <img
                src={fullImgUrl}
                alt={shipName}
                className="w-full h-48 object-cover rounded-t-xl"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/228d9c/ffffff?text=${shipName}`; }}
            />
            <div className="p-5 flex flex-col justify-between flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-2">
                        <h3 className="text-2xl font-extrabold text-cyan-700 truncate">{shipName}</h3>
                        <h3 className="text-sm font-semibold text-gray-500 mt-1">Port Name: {currentPortName}</h3>
                        <h3 className="text-sm font-semibold text-gray-500 mt-1">Port ID: {currentPortId} </h3>
                    </div>
                    <span className="inline-block flex-shrink-0 px-3 py-1 rounded-full text-sm font-bold bg-cyan-600 text-white shadow-lg self-center">
                        {status}
                    </span>
                </div>
                <div className="space-y-2 text-sm text-cyan-700 border-t pt-4">
                    <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">{shipType}</span>
                        <span className="font-semibold text-cyan-800">{maxStorageCapacity} {storageUnit}</span>
                    </p>
                    <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">Remain Storage Capacity:</span>
                        <span className="font-semibold text-cyan-800">{remain_storage_capacity} {storageUnit}</span>
                    </p>
                    <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">Destination Port Name : {destinationPortName}</span>
                        <span className="font-semibold text-cyan-800">Destination Port ID : {destinationPortId}</span>
                    </p>
                    <p className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">Last Port Name : {lastPortName}</span>
                        <span className="font-semibold text-cyan-800">Last Port ID : {lastPortId}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ShipCard;