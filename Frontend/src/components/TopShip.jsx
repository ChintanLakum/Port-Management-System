import { useEffect, useState } from "react";
import ShipCard from "../pages/Ship/ShipCard"

const TopShips = () => {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopShips = async () => {
      try {
        const res = await fetch(`/api/ship/all`);
        const data = await res.json();
        console.log(data)
        const shipArray = Array.isArray(data) ? data : data.ships || [];
       
        const topShips = shipArray
          .sort((a, b) => b.list_of_orders.length - a.list_of_orders.length)
          .slice(0, 5);
           console.log(topShips[0].list_of_orders.length)
        setShips(topShips);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopShips();
  }, []);

  if (loading) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8 text-center">
        Top Performing Ships
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {ships.map((ship) => (
          <ShipCard key={ship.ship_id} ship={ship} />
        ))}
      </div>
    </section>
  );
};

export default TopShips;
