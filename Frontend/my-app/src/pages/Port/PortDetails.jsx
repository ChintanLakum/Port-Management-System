import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { AiOutlineForm } from "react-icons/ai";
import { MapPin, Anchor, Warehouse, Ship } from "lucide-react";
import Message from "../../components/Message";
import Ships from "../Ship/Ships";
import { toast } from "react-toastify";


export default function PortDetails() {
  const { portId } = useParams();
  const navigate = useNavigate();
  const [port, setPort] = useState(null);
  const [error, setError] = useState(null);
  // const [message, setMessage] = useState(null);

  const BACKEND_BASE_URL = "http://localhost:5000";

  const { isAdmin, isSystemAdmin, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (portId) fetchPort();
  }, [portId]);

  const fetchPort = async () => {
  try {
    const res = await fetch(`/api/port/${portId}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch port details");

    const data = await res.json();
    setPort(data.port);
  } catch (error) {
    setError(error.message);
    toast.error(error.message || "Unable to load port details");
  }
};


  const handleUpdatePort = () => {
  navigate(`/updatePort/${port.port_id}`, { state: { port } });
};


  const handleRemovePort = async () => {
  if (!window.confirm(`Delete port ${port.port_name}?`)) {
    toast.info("Port deletion cancelled");
    return;
  }

  try {
    const res = await fetch(`/api/port/${portId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete port");

    toast.success("Port deleted successfully");
    setTimeout(() => navigate("/"), 1500);
  } catch (error) {
    setError(error.message);
    toast.error(error.message );
  }
};


  if (!port && !error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-14 w-14 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const imgUrl = port?.img_url
    ? `${BACKEND_BASE_URL}${port.img_url}`
    : "https://placehold.co/1600x700/0891b2/ffffff?text=Port";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-10">
      {/* {(message || error) && <Message message={message} error={error} />} */}

      {/* HERO */}
      <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl shadow-xl">
        <img
          src={imgUrl}
          alt={port.port_name}
          className="w-full h-[260px] sm:h-[360px] md:h-[420px] object-cover"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/1600x700/0891b2/ffffff?text=Port")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold">
              {port.port_name}
            </h1>
            <p className="flex items-center gap-2 text-cyan-200 mt-1">
              <MapPin size={18} /> {port.city}
            </p>
          </div>

          <div className="flex gap-3">
            {isAdmin && (
              <button
                onClick={handleUpdatePort}
                className="flex items-center gap-2 px-5 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition"
              >
                <AiOutlineForm /> Update
              </button>
            )}

            {isSystemAdmin && (
              <button
                onClick={handleRemovePort}
                className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                <FaTrash /> Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Anchor />}
          label="Status"
          value={port.status}
        />
        <StatCard
          icon={<Warehouse />}
          label="Total Docks"
          value={port.total_docks}
        />
        <StatCard
          icon={<Ship />}
          label="Ships Docked"
          value={port.available_ships}
        />
        <StatCard
          icon={<Warehouse />}
          label="Available Docks"
          value={port.total_docks - port.available_ships}
        />
      </div>

      {/* SHIPS */}
      {isLoggedIn && !isAdmin && !isSystemAdmin && (
        <div className="max-w-7xl mx-auto mt-12">
          <Ships portId={portId} />
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-cyan-100 text-cyan-700">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}