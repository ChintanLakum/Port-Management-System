import { useEffect, useState } from "react";
import PortCard from "../pages/Port/PortCard";

const TopPorts = () => {
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const res = await fetch("/api/port/all");
        const data = await res.json();
        console.log(data)
        const portsArray = Array.isArray(data) ? data : data.ports || [];

        const busiestPorts = portsArray
          .filter(
            (port) =>
              port.total_docks > 0 &&
              port.available_ships > 0 &&
              port.available_ships <= port.total_docks
          )
          .sort((a, b) => b.available_ships - a.available_ships)
          .slice(0, 5);
          console.log(busiestPorts)
        setPorts(busiestPorts);
      } catch (error) {
        console.error("Failed to fetch ports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPorts();
  }, []);

  if (loading) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8 text-center">
          ⚓ Busiest Ports (Most Ships Docked)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {ports.map((port) => (
            <PortCard key={port.port_id} port={port} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopPorts;
