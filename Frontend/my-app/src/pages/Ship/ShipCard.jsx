import { useNavigate } from "react-router-dom";

const ShipCard = ({ ship }) => {
  const navigate = useNavigate();

  const {
    ship_id,
    ship_name,
    ship_type,
    max_storage_capacity,
    remain_storage_capacity,
    storage_unit,
    status,
    current_port_id,
    current_port_name,
    last_port_id,
    last_port_name,
    destination_port_id,
    destination_port_name,
    img_url,
  } = ship;

  const BACKEND_BASE_URL = "http://localhost:5000";
  const fullImgUrl = `${BACKEND_BASE_URL}${img_url}`;

  return (
    <div
      onClick={() => navigate(`/shipDetails/${ship_id}`)}
      className="bg-white rounded-2xl shadow-lg w-full flex flex-col overflow-hidden 
                 transition-transform duration-300 hover:scale-[1.02] hover:shadow-cyan-600/40 cursor-pointer"
    >
      {/* Image */}
      <img
        src={fullImgUrl}
        alt={ship_name}
        className="w-full h-40 sm:h-44 md:h-48 object-cover"
        onError={(e) => {
          e.target.src = `https://placehold.co/600x400/228d9c/ffffff?text=${ship_name}`;
        }}
      />

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-cyan-700 truncate">
              {ship_name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {current_port_name} (ID: {current_port_id})
            </p>
          </div>

          <span
            className={`px-2 py-1 text-xs sm:text-sm rounded-full font-semibold 
            ${
              status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-cyan-100 text-cyan-700"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t my-3"></div>

        {/* Details */}
        <div className="text-sm space-y-2 text-gray-700 flex-grow">
          <div className="flex justify-between">
            <span className="text-gray-500">Type</span>
            <span className="font-medium">{ship_type}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Capacity</span>
            <span className="font-medium">
              {max_storage_capacity} {storage_unit}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Remaining</span>
            <span className="font-medium">
              {remain_storage_capacity} {storage_unit}
            </span>
          </div>
        </div>

        {/* Footer – stacked on mobile */}
        <div className="mt-4 text-xs sm:text-sm text-gray-600 space-y-1">
          <p className="truncate">
            <span className="font-semibold">Destination:</span>{" "}
            {destination_port_name} (ID: {destination_port_id})
          </p>
          <p className="truncate">
            <span className="font-semibold">Last Port:</span>{" "}
            {last_port_name} (ID: {last_port_id})
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShipCard;
