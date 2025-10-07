import { useNavigate } from "react-router-dom";

const PortCard = (port) => {
  const navigate = useNavigate();
  const portId = port.port.port_id;
  const portName = port.port.port_name;
  const adminId = port.port.admin_id;
  const status = port.port.status;
  const shipsInPort = port.port.available_ships;
  const totalDocks = port.port.total_docks;
  const city = port.port.city;
  const relativeImgUrl = port.port.img_url;
  const BACKEND_BASE_URL = 'http://localhost:5000';
  const fullImgUrl = `${BACKEND_BASE_URL}${relativeImgUrl}`;
     return (
    <div
      className="bg-white rounded-xl shadow-2xl w-full sm:max-w-sm lg:max-w-md mx-auto m-4 flex flex-col transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-cyan-600/70 cursor-pointer"
      onClick={() => navigate(`/portDetails/${portId}`)}
    >
      {/* Image section with fixed aspect ratio */}
      <img
        src={fullImgUrl}
        alt={portName}
        className="w-full h-48 object-cover rounded-t-xl"
        // Fallback for placeholder
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/228d9c/ffffff?text=${portName}`; }}
      />
      
      {/* Content area */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-2xl font-extrabold text-cyan-700 truncate">{portName}</h3>
            <h3 className="text-sm font-semibold text-gray-500 mt-1">Admin ID: {adminId}</h3>
          </div>
          {/* Status Badge */}
          <span className="inline-block flex-shrink-0 px-3 py-1 rounded-full text-sm font-bold bg-cyan-600 text-white shadow-lg self-center">
            {status}
          </span>
        </div>

        {/* Port Details */}
        <div className="space-y-2 text-sm text-cyan-700 border-t pt-4">
          <p className="flex justify-between items-center">
            <span className="font-medium text-gray-600">City:</span>
            <span className="font-semibold text-cyan-800">{city}</span>
          </p>
          <p className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Available Docks:</span>
            <span className="font-semibold text-cyan-800">{totalDocks - shipsInPort} / {totalDocks}</span>
          </p>
          <p className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Ships in Port:</span>
            <span className="font-semibold text-cyan-800">{shipsInPort}</span>
          </p>
        </div>
      </div>
    </div>
  );
};


export default PortCard;