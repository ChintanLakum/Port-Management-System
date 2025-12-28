import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PortCard from "./PortCard";
import SearchBar from "../../components/Searchbar";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Ports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ports, setPorts] = useState([]);
  const [portsToRender, setPortsToRender] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { isLoggedIn, isSystemAdmin} = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchPorts();
  }, []);

  const fetchPorts = async () => {
  try {
    const response = await fetch("/api/port/all");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    const portsArray = Array.isArray(data) ? data : data.ports || [];
    
    setPorts(portsArray);
    setPortsToRender(portsArray);
    setError(null);
    // toast.success("Ports loaded successfully");
  } catch (err) {
    console.error("Failed to fetch ports:", err);
    setError("Failed to load ports. Please try again later.");
    toast.error("Failed to load ports");
  } finally {
    setLoading(false);
  }
};


  const handleFilteredPortsChange = useCallback((newFilteredPorts) => {
  setPortsToRender(newFilteredPorts);
  setHasSearched(true);

  if (newFilteredPorts.length === 0) {
    // toast.info("No ports match your search");
  }
}, []);


  const handleAddPort = () => {
  toast.info("Opening Add Port form");
  navigate("/addPort");
};


  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Ports Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage all ports efficiently from a single dashboard</p>
      </div>

      
      <div className="max-w-7xl mx-auto mb-6 flex-col sm:flex-row gap-4">
        <div className="flex-1">
          
            <SearchBar 
              data={ports} 
              onFilterChange={handleFilteredPortsChange} 
              className="flex-1 h-full"
            />
           {/* Add Port button */}
          {isSystemAdmin && <div className="flex-1">
          <div className="bg-white mt-0 p-0 rounded-xl shadow-md flex h-8 sm:h-10">
            <button
              onClick={handleAddPort}
              className="mx-auto px-2 flex items-center justify-center gap-2 w-full h-full  bg-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:bg-cyan-700 transition duration-300"
            >
              Add Port
            </button>
          </div>
        </div>}

        </div>
      </div>

      {/* Ports Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading &&
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          ))
        }

        {error && (
          <div className="col-span-full flex justify-center items-center py-16">
            <p className="text-red-500 text-lg font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && portsToRender.length === 0 && (
          <div className="col-span-full flex justify-center items-center py-16">
            <p className="text-gray-600 text-lg font-medium">
              {hasSearched ? "No results found." : "No ports available."}
            </p>
          </div>
        )}

        {!loading && !error &&
          portsToRender.map((port) => (
            <div
              key={port.port_id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
            >
              <PortCard port={port} />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Ports;
