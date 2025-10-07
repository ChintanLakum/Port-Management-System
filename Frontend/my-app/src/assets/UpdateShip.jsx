import Message from "./Message";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CustomDropdown from "./CustomDropdown";

const UpdateShip = () => {
    const { shipId } = useParams();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [isConfirming, setIsConfirming] = useState(false); 
    const ship = location.state?.ship;
    const [formData, setFormData] = useState(ship || {});

    useEffect(() => {
        if (ship && Object.keys(ship).length > 0) {
            setFormData(ship);
        }
    }, [ship, shipId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDropdownChange = (name) => (value) => {
        console.log('Name:', name);
        console.log('Value:', value);
        if (name && value) {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setFormData((prevData) => ({
                ...prevData,
                imageFile: e.target.files[0],
            }));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsConfirming(true);
    }
    const handleCancelUpdate = () => {
        setIsConfirming(false);
    };

     const handleConfirmUpdate = async () => {
        setIsConfirming(false);
        
        if (!formData.ship_id) {
            setError("Cannot update. Ship data is missing an ID.");
            return;
        }
        try {
            const dataToSend = { ...formData };
            delete dataToSend.imageFile; 
            const bodyContent = JSON.stringify(dataToSend);
            const responce = await fetch(`/api/ship/updateShip/${shipId}`,
                {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: bodyContent,
                });

            if (responce.ok) {
                if (responce.status === 204) {
                    console.log(`Ship ${shipId} updated successfully (204 No Content).`);
                } else {
                    const data = await responce.json();
                    console.log(`Ship ${shipId} updated successfully.`, data);
                }
            }
            else if (responce.status === 404) {
                const data = await responce.json();
                console.error(`Error: Ship ${shipId} not found.`);
                console.log(data.message)

            } else {
                const errorData = await responce.text();
                console.error("Failed to update ship:", errorData.message || responce.statusText);
            }
        } catch (error) {
            console.error("Network error during ship updation:", error);

        }
        finally {
            navigate("/ships");
            console.log("Ship Update attempt finished.");
        }
    }
    console.log("formData", formData);
    const inputClassNames = "mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-inner text-gray-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600";
    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8 flex items-start justify-center font-sans">
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-xl lg:max-w-3xl transform transition-all duration-300 ring-4 ring-cyan-50/70">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-cyan-700 tracking-tight">
                    Update Ship
                </h2>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {(message || error) && <Message message={message} error={error} />}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Ship Name - CORRECTED name attribute */}
                        <div>
                            <label htmlFor="ship_name" className="block text-sm font-semibold text-gray-700 mb-1">
                                Ship Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="ship_name" // CORRECTED: Matches state key
                                id="ship_name"
                                value={formData.ship_name || ""}
                                onChange={handleChange}
                                required
                                placeholder="The Sea Serpent"
                                className={inputClassNames}
                            />
                        </div>
                        <div>
                            <label htmlFor="ship_id" className="block text-sm font-semibold text-gray-700 mb-1">
                                Ship ID
                            </label>
                            <input
                                type="text"
                                name="ship_id" 
                                id="ship_id"
                                value={formData.ship_id || ''}
                                onChange={handleChange}
                                placeholder="P-ABC"
                                className={inputClassNames}
                            />
                        </div>

                        <div>
                            <label htmlFor="ship_type" className="block text-sm font-semibold text-gray-700 mb-1">
                                Ship Type
                            </label>
                            <CustomDropdown
                                name="ship_type" 
                                options={['CARGO', 'TANKER', 'GENERAL']}
                                selected={formData.ship_type || 'CARGO'}
                                onSelect={handleDropdownChange('ship_type')}
                            />
                        </div>

                        {/* Max Storage Capacity - CORRECTED name attribute */}
                        <div>
                            <label htmlFor="max_storage_capacity" className="block text-sm font-semibold text-gray-700 mb-1">
                                Max Storage Capacity <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="max_storage_capacity" // CORRECTED: Matches state key
                                id="max_storage_capacity"
                                value={formData.max_storage_capacity || ''}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 1000"
                                className={inputClassNames}
                                min={1}
                            />
                        </div>

                        {/* Storage Unit Dropdown - CORRECTED name attribute */}
                        <div>
                            <label htmlFor="storage_unit" className="block text-sm font-semibold text-gray-700 mb-1">
                                Storage Unit
                            </label>
                            <CustomDropdown
                                name="storage_unit" // CORRECTED: Matches state key
                                options={['TEU', 'TONS', 'M3']}
                                selected={formData.storage_unit || "TONS"}
                                onSelect={handleDropdownChange('storage_unit')} // CORRECTED: Matches state key
                            />
                        </div>

                        {/* Current Port Name - CORRECTED name attribute */}
                        <div>
                            <label htmlFor="current_port_name" className="block text-sm font-semibold text-gray-700 mb-1">
                                Current Port Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="current_port_name" // CORRECTED: Matches state key
                                id="current_port_name"
                                value={formData.current_port_name || ''}
                                onChange={handleChange}
                                required
                                placeholder="Port of Singapore"
                                className={inputClassNames}
                            />
                        </div>

                        {/* Current Status Dropdown - CORRECTED name attribute */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
                                Current Status
                            </label>
                            <CustomDropdown
                                name="status"
                                options={['DOCKED', 'IN ROUTE', 'MAINTENANCE', 'OUT OF SERVICE']}
                                selected={formData.status || 'DOCKED'}
                                onSelect={handleDropdownChange('status')}
                            />
                        </div>

                        {/* Last Port Name - CORRECTED name attribute */}
                        <div>
                            <label htmlFor="last_port_name" className="block text-sm font-semibold text-gray-700 mb-1">
                                Last Port Name
                            </label>
                            <input
                                type="text"
                                name="last_port_name" // CORRECTED: Matches state key
                                id="last_port_name"
                                value={formData.last_port_name || ''}
                                onChange={handleChange}
                                placeholder="Port of Shanghai"
                                className={inputClassNames}
                            />
                        </div>

                        {/* Last Port Id - CORRECTED name attribute */}
                        <div>
                            <label htmlFor="last_port_id" className="block text-sm font-semibold text-gray-700 mb-1">
                                Last Port ID
                            </label>
                            <input
                                type="text"
                                name="last_port_id" // CORRECTED: Matches state key
                                id="last_port_id"
                                value={formData.last_port_id || ''}
                                onChange={handleChange}
                                placeholder="P-ABC"
                                className={inputClassNames}
                            />
                        </div>
                        
                        {/* Remain Storage Capacity - CORRECTED name attribute */}
                        <div>
                            <label htmlFor="remain_storage_capacity" className="block text-sm font-semibold text-gray-700 mb-1">
                                Remain Storage Capacity <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="remain_storage_capacity" // CORRECTED: Matches state key
                                id="remain_storage_capacity"
                                value={formData.remain_storage_capacity || ''}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 1000"
                                className={inputClassNames}
                                min={1}
                            />
                        </div>

                        {/* Destination Port Name - CORRECTED name attribute */}
                        <div>
                            <label htmlFor="destination_port_name" className="block text-sm font-semibold text-gray-700 mb-1">
                                Destination Port Name
                            </label>
                            <input
                                type="text"
                                name="destination_port_name" // CORRECTED: Matches state key
                                id="destination_port_name"
                                value={formData.destination_port_name || ''}
                                onChange={handleChange}
                                placeholder="Port of Shanghai"
                                className={inputClassNames}
                            />
                        </div>

                        {/* Destination Port ID - CORRECTED name attribute */}
                        <div>
                            <label htmlFor="destination_port_id" className="block text-sm font-semibold text-gray-700 mb-1">
                                Destination Port ID
                            </label>
                            <input
                                type="text"
                                name="destination_port_id" // CORRECTED: Matches state key
                                id="destination_port_id"
                                value={formData.destination_port_id || ''}
                                onChange={handleChange}
                                placeholder="P-ABC"
                                className={inputClassNames}
                            />
                        </div>

                        {/* Image File Upload */}
                        <div className="md:col-span-2 lg:col-span-3">
                            <label
                                htmlFor="imageFile"
                                className="block text-sm font-semibold text-gray-700 mb-1" >
                                Upload Ship Photo
                            </label>
                            <div className="flex items-center mt-1 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-cyan-600 transition duration-300">
                                <input
                                    type="file"
                                    name="imageFile"
                                    id="imageFile"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-gray-700 px-3 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-cyan-100 file:text-cyan-700 hover:file:bg-cyan-200 cursor-pointer transition duration-150 bg-transparent" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit" 
                        className="w-full flex justify-center items-center py-3 px-4 mt-10 border border-transparent rounded-lg shadow-xl text-lg font-bold text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-cyan-600 disabled:bg-cyan-400 transition duration-300 transform hover:scale-[1.005] hover:shadow-2xl active:scale-[0.99]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                Updating Ship...
                            </>
                        ) : "Update Ship Now"}
                    </button>
                </form>
            </div>


            {isConfirming && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full transform transition-all duration-300 scale-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Update</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to update ship **{shipId}**?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCancelUpdate}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmUpdate}
                                className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition"
                            >
                                Confirm Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateShip