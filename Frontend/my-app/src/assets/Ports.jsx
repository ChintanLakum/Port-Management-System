import { useEffect, useState, useCallback } from "react";
import PortCard from "./PortCard";
import SearchBar from "./Searchbar";

const Ports = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ports, setPorts] = useState([]);
    const [portsToRender, setPortsToRender] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

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

        } catch (err) {
            console.error("Failed to fetch ports:", err);
            setError("Failed to load ports. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleFilteredPortsChange = useCallback((newFilteredPorts) => {
            setPortsToRender(newFilteredPorts);
            setHasSearched(true);
        }, []);

    return (
        <>
            <SearchBar data={ports} onFilterChange={handleFilteredPortsChange} />
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
        </>
    );
};

export default Ports;