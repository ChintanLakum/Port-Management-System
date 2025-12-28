import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import ShipCard from "./ShipCard";
import SearchBar from "../../components/Searchbar";
import { useParams } from "react-router-dom";

const Ships = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ships, setShips] = useState([]);
    const [shipsToRender, setShipsToReder] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const { portId, isAdmin, isLoggedIn, isSystemAdmin } = useSelector((state) => state.auth)
    let fetchUrl = `/api/ship/all`
    if (isAdmin) {
        fetchUrl = `/api/ship/all/${portId}`
    }
    if (isSystemAdmin) {
        fetchUrl = `/api/ship/all`
    }
    if (isLoggedIn && !isAdmin && !isSystemAdmin) {
        const { portId } = useParams()
        fetchUrl = `/api/ship/all/${portId}`
    }
    useEffect(() => {
        fetchShips();
    }, [portId, fetchUrl]);

    const fetchShips = async () => {
        try {
            const response = await fetch(fetchUrl, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let shipArray = Array.isArray(data) ? data : data.ships || [];

            setShips(shipArray);
            setShipsToReder(shipArray);
            setError(null);

        } catch (err) {
            console.error("Failed to fetch ships:", err);
            setError("Failed to load ships. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    const handleFilteredPortsChange = useCallback((newFilteredPorts) => {
        setShipsToReder(newFilteredPorts);
        setHasSearched(true);
    }, []);

    return (
        <>
            <SearchBar data={ships} onFilterChange={handleFilteredPortsChange} />
            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                gap-6 sm:gap-8 my-6 px-4 sm:px-6 max-w-7xl">
                {loading && <p className="md:col-span-4 text-center">Loading ships...</p>}
                {error && <p className="md:col-span-4 text-center text-red-500">{error}</p>}
                {!loading && !error && (
                    <>
                        {shipsToRender.length > 0 ? (
                            shipsToRender.map((ship) => (
                                <ShipCard key={ship.ship_id} ship={ship} />
                            ))
                        ) : (

                            ships.length > 0 && hasSearched ? (
                                <p className="md:col-span-4 text-center">No results found for your search.</p>
                            ) : (
                                <p className="md:col-span-4 text-center">No ships found.</p>
                            )
                        )}
                    </>
                )}
            </div>
        </>
    );
};


export default Ships