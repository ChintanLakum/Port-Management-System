import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CustomDropdown from './CustomDropdown';
import { useSelector } from 'react-redux';
import { MdErrorOutline } from 'react-icons/md';

const NewOrder = () => {
    const location = useLocation();
    const { ship } = location.state
    console.log(ship)
    const { userId } = useSelector(
        (state) =>
            state.auth
    )

    const [formData, setFormData] = useState({
        userId: userId,
        shipId: ship.ship_id,
        shipName: ship.ship_name,
        shipType: ship.ship_type,
        storageUnit: ship.storage_unit,
        currentPortId: ship.current_port_id,
        currentPortName: ship.current_port_name,
        destinationPortName: ship.destination_port_name,
        destinationPortId: ship.destination_port_id,
        remainStorageCapacity :ship.remain_storage_capacity,

    });

    const calculateMockCost = (storage) => {
        if (storage) {
            if (storage < 0) return 0;
            return 1000 + (storage * 500);
        }
        else {
            return 0
        }
    };

    const totalEstimatedCost = calculateMockCost(formData.storage);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let finalValue = value;
        if (type === 'number') {
            finalValue = parseInt(value) || 0;
        }
        setFormData(prevData => ({
            ...prevData,
            [name]: finalValue,
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

    const handleSubmit = async (e) => {
        
        e.preventDefault();


        try {
            if(ship.remain_storage_capacity >0){
            
        
            const { shipId, userId, currentPortName, destinationPortName, destinationPortId, currentPortId, storageUnit, storage, remainStorageCapacity } = formData
            const orderData = new FormData();
            orderData.append("ship_id", shipId);
            orderData.append("user_id", userId);
            orderData.append("current_port_id", currentPortId);
            orderData.append("destination_port_id", destinationPortId);
            orderData.append("current_port_name", currentPortName);
            orderData.append("destination_port_name", destinationPortName);
            orderData.append("storage", storage);
            orderData.append("storage_unit", storageUnit);
            orderData.append("remain_storage_capacity", remainStorageCapacity);

            const finalOrder = {
                ship_id: shipId,
                user_id: userId,
                current_port_name: currentPortName,
                current_port_id: currentPortId,
                destination_port_name: destinationPortName,
                destination_port_id: destinationPortId,
                storage: storage,
                storage_unit: storageUnit,
                remain_storage_capacity:remainStorageCapacity,
            };

            console.log("Order Ready to be Placed:", finalOrder);
            const responce = await fetch("/api/order/place", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalOrder),
            });
            if (responce.ok) {

            }
            }
            else{
                console.log("Ship is full already")
            }
        }
        catch (error) {

        }

    };

    const inputClassNames = "mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-inner text-gray-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600";

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8 flex items-start justify-center font-sans">
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-xl lg:max-w-3xl transform transition-all duration-300 ring-4 ring-cyan-50/70">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-cyan-700 tracking-tight">
                    Place New Order
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Booking cargo on {formData.shipName} departing from {formData.currentPortName || 'N/A'}**.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="p-6 bg-cyan-50 rounded-xl border border-cyan-200">
                        <h3 className="text-xl font-bold text-cyan-800 mb-4">Cargo Requirements</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="storage" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Required Cargo Space ({formData.storage}) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="storage"
                                    id="storage"
                                    value={formData.storage || 0}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., 5"
                                    className={inputClassNames}
                                    min={1}
                                    max={ship.remain_storage_capacity}
                                />
                            </div>

                            {/* STORAGE_UNIT (REQUIRED) */}
                            <div>
                                <label htmlFor="storageUnit" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Storage Unit Type <span className="text-red-500">*</span>
                                </label>
                                <CustomDropdown
                                    name="storageUnit"
                                    options={['TONS', 'M3', 'TEU']}
                                    selected={formData.storageUnit}
                                    onSelect={handleDropdownChange('storageUnit')}
                                />
                            </div>
                        </div>
                    </div>


                    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">User Credential</h3>
                        <p className="mt-2 text-xs text-gray-500">
                            UserId: {formData.userId}
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Destination</h3>

                        <div>
                            <label htmlFor="destinationPortName" className="block text-sm font-semibold text-gray-700 mb-1">
                                Required Cargo Space ({formData.storageUnit}) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="destinationportName"
                                id="destinationPortName"
                                value={formData.destinationPortName}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Kandla"
                                className={inputClassNames}
                            />
                            {formData.destinationPortId && (
                                <p className="mt-2 text-xs text-gray-500">
                                    Selected Port ID: {formData.destinationPortId}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 3. COST & SUBMISSION */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="bg-green-50 p-4 rounded-lg text-lg font-bold flex justify-between items-center mb-6 shadow-inner">
                            <span>Estimated Cost:</span>
                            <span className="text-green-700 text-3xl">${totalEstimatedCost.toLocaleString()}</span>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-xl shadow-lg text-lg font-extrabold text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition duration-150 transform hover:scale-[1.01] active:scale-95"
                        >
                            Confirm Order & Proceed to Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default NewOrder;
