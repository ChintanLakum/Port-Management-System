import { useState, useEffect } from "react";
import ShipCard from "./ShipCard";

const DockShip = () => {
    const [ships, setShips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchShipForDock()
    }, [])
    const fetchShipForDock = async () => {
        try {
            const response = await fetch("/api/ship/inRoute", {
                method: "GET",
            });
            if (response.ok) {
                const data = await response.json();
                let shipArray = Array.isArray(data) ? data : data.ships || [];
                console.log("data", data)
                // console.log(shipArray)
                setShips(shipArray);
                setError(null);

            }
        } catch (err) {
            console.error("Failed to fetch ships in route:", err);
            setError("Failed to load ships in route. Please try again later.");
        } finally {
            setLoading(false);
        }
    }
    
   
    return (
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                gap-6 sm:gap-8 my-6 px-4 sm:px-6 max-w-7xl">
            {loading && <p className="md:col-span-4 text-center">Loading ships...</p>}
            {error && <p className="md:col-span-4 text-center text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    {ships.length > 0 ? (
                        ships.map((ship) => (
                            <ShipCard key={ship.ship_id} ship={ship} />
                        ))
                    ) : (
                         <p className="md:col-span-4 text-center">No ships found.</p>
                    )}
                </>
            )}
        </div>

    )

}

export default DockShip