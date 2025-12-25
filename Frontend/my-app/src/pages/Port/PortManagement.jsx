import { useNavigate } from "react-router-dom";
import Ports from "./Ports";
import PortCard from "./PortCard";
import { useSelector } from "react-redux";
import SearchBar from "../../components/Searchbar";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";


const PortManagement = () => {
  const imageUrl = "../public/images/bgimage2.png";
  const [ports, setPorts] = useState([]);
  const [portsToRender, setPortsToRender] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, isSystemAdmin } = useSelector(
    (state) => state.auth
  );


  useEffect(() => {
    if (!isLoggedIn) {
      toast.warning("Please log in to access port management");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchPorts();
  }, []);

  const fetchPorts = async () => {
    try {
      const response = await fetch("/api/port/all", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let portsArray = Array.isArray(data) ? data : data.ports || [];

      setPorts(portsArray);
      setPortsToRender(portsArray);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch ports:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleFilteredPortsChange = useCallback((newFilteredPorts) => {
    setPortsToRender(newFilteredPorts);
    setHasSearched(true);
  }, []);


  if (!isLoggedIn) {
    return (

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6 py-4 sm:p-8 font-sans">
        <div className="bg-white p-5 sm:p-10 rounded-2xl shadow-2xl text-center border-t-8 border-cyan-500 max-w-xs sm:max-w-md w-full transition-all duration-500 hover:shadow-cyan-400/50">
          <span className="text-5xl mb-4 inline-block text-cyan-600">🔒</span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Authorization Required
          </h2>
          <p className="text-xs sm:text-base text-gray-500 mb-8">
            This page is for management use only. Please <strong className="text-cyan-600 font-bold">log in</strong> to continue.
          </p>

          <div className="space-y-4">
            <button
              className="w-full bg-cyan-600 text-white py-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-[1.02] hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 font-bold tracking-wide"
              onClick={() => navigate("/login")}
            >
              Secure Login
            </button>

            <button
              className="w-full bg-transparent border border-gray-300 text-gray-700 py-3 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02] hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 font-semibold"
              onClick={() => navigate("/")}
            >
              Back To Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn && isSystemAdmin) {
    return (
      <div className="flex flex-col justify-between">
        <div className="flex flex-row ml-20">
          <SearchBar data={ports} onFilterChange={handleFilteredPortsChange} />
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 lg:gap-12 mt-4 w-full ">
            <button
              className="bg-cyan-700 text-base py-3 px-1 mx-6 text-white w-2/5 md:w-1/4 lg:w-1/5 rounded-full shadow-lg hover:bg-cyan-800 transition duration-300 ease-in-out transform hover:scale-105 "
              onClick={() => {
                navigate("/addPort");
              }}
            >
              Add Port
            </button>

          </div>
        </div>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                gap-6 sm:gap-8 my-6 px-4 sm:px-6 max-w-7xl">
          {loading && <p className="md:col-span-4 text-center">Loading ports...</p>}
          {error && <p className="md:col-span-4 text-center text-red-500">{error}</p>}
          {!loading && !error && (
            <>
              {portsToRender.length > 0 ? (
                portsToRender.map((port) => (
                  <PortCard key={port.port_id} port={port} />
                ))
              ) : (

                ports.length > 0 && hasSearched ? (
                  <p className="md:col-span-4 text-center">No results found for your search.</p>
                ) : (
                  <p className="md:col-span-4 text-center">No ports found.</p>
                )
              )}
            </>
          )}
        </div>
      </div>

    );
  }
  if (isLoggedIn && !isSystemAdmin) {
    return <>
      <Ports />
    </>
  }
};

export default PortManagement;
