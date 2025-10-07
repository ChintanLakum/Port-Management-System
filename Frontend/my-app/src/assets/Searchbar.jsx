import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";


const SearchBar = ({ data, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    useEffect(() => {
        const query = searchTerm.toLowerCase().trim();
        let filteredResults = data;
        if (query.length > 0 && Array.isArray(data) && data.length > 0) {
            filteredResults = data.filter(item => {
                const isShipMatch = (
                    item.ship_name?.toLowerCase().includes(query) || 
                    item.current_port_name?.toLowerCase().includes(query) ||
                    item.last_port_name?.toLowerCase().includes(query) ||
                    item.destination_port_name?.toLowerCase().includes(query)
                );

                // Check common port properties
                const isPortMatch = (
                    item.port_name?.toLowerCase().includes(query) || 
                    item.city?.toLowerCase().includes(query) ||
                    item.port_id?.toLowerCase().includes(query)
                );

                // Check common route properties (assuming a route might have a name or ID)
                //  const isRouteMatch = (
                //     item.route_name?.toLowerCase().includes(query) ||
                //     item.route_id?.toLowerCase().includes(query)
                //  );isRouteMatch
                
                return isShipMatch || isPortMatch ;
            });
        }
        
        if (typeof onFilterChange === 'function') {
            onFilterChange(filteredResults);
        } else {
            console.error("SearchBar: Prop 'onFilterChange' is required and must be a function.");
        }
    }, [searchTerm, data, onFilterChange]); 
    
    return (
        <div className="flex justify-center w-full my-8 px-4 sm:px-6 md:px-8">
            <div className="relative w-full max-w-2xl justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 text-xl sm:text-2xl md:text-3xl">
                    <IoSearch />
                </div>
                <input
                    type="search"
                    placeholder="Search ports & ships For order"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className=" w-full p-3 pl-9 sm:pl-10 md:pl-12 text-gray-900 border border-gray-300 rounded-full bg-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none text-base sm:text-lg"
                />
                {searchTerm && (
                    <button
                        onClick={handleClearSearch}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label="Clear search"
                    >
                        &#x2715;
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;