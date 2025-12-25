import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PortCard = ({ port }) => {
  const navigate = useNavigate();


  const handleNavigate = () => {
    navigate(`/portDetails/${port_id}`);
  };


  const {
    port_id,
    port_name,
    status,
    available_ships,
    total_docks,
    city,
    img_url,
  } = port;

  const BACKEND_BASE_URL = "http://localhost:5000";
  const fullImgUrl = `${BACKEND_BASE_URL}${img_url}`;

  const utilization = total_docks
    ? Math.round((available_ships / total_docks) * 100)
    : 0;

  return (
    <div
      onClick = { handleNavigate }
      
      className="group bg-white rounded-2xl shadow-lg w-full flex flex-col overflow-hidden
                 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-600/40 cursor-pointer"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={fullImgUrl}
          alt={port_name}
          className="w-full h-36 sm:h-40 md:h-44 object-cover"
          onError={(e) =>
            (e.target.src = `https://placehold.co/600x400/228d9c/ffffff?text=${port_name}`)
          }
        />

        {/* Status badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-xs sm:text-sm rounded-full font-semibold shadow
            ${status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
            }`}
        >
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-cyan-700 truncate">
          {port_name}
        </h3>
        <p className="text-sm text-gray-500 truncate">{city}</p>

        {/* Divider */}
        <div className="border-t my-3"></div>

        {/* Stats */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Total Docks</span>
            <span className="font-medium">{total_docks}</span>
          </div>

          <div className="flex justify-between">
            <span>Ships Docked</span>
            <span className="font-medium">{available_ships}</span>
          </div>

          <div className="flex justify-between">
            <span>Available</span>
            <span className="font-medium">
              {total_docks - available_ships}
            </span>
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Port Utilization</span>
            <span>{utilization}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all
                ${utilization > 80
                  ? "bg-red-500"
                  : utilization > 50
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              style={{ width: `${utilization}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4">
          <span className="text-cyan-600 text-sm font-semibold group-hover:underline">
            View Port Details →
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortCard;
