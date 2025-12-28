import Message from "../../components/Message";
import { useEffect, useState } from "react";
import CustomDropdown from "../../components/CustomDropdown";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddShip = () => {
  const [shipData, setShipData] = useState({
    shipId: "",
    shipName: "",
    shipType: "CARGO",
    maxStorageCapacity: 0,
    remainStorageCapacity: 0,
    storageUnit: "TONS",
    status: "DOCKED",
    currentPortId: null,
    currentPortName: "",
    lastPortId: "",
    lastPortName: "",
    destinationPortName: "",
    destinationPortId: "",
    listOfOrders: "",
    imageFile: null,
  });

  const { portId, isAdmin, isSystemAdmin } = useSelector(
    (state) => state.auth
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? Number(value) : value;
    setShipData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setShipData((prevData) => ({
        ...prevData,
        imageFile: e.target.files[0],
      }));
    }
  };

  const handleDropdownChange = (name) => (value) => {
    if (name && value) {
      setShipData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    const {
      shipName, shipType, maxStorageCapacity,
      storageUnit, currentPortName, currentPortId, lastPortId, lastPortName, destinationPortId,
      destinationPortName, status, imageFile, remainStorageCapacity
    } = shipData;

    try {
      const formData = new FormData();
      formData.append("ship_name", shipName);
      formData.append("ship_type", shipType);
      formData.append("max_storage_capacity", maxStorageCapacity);
      formData.append("remain_storage_capacity", remainStorageCapacity);
      formData.append("storage_unit", storageUnit);
      formData.append("status", status);
      formData.append("current_port_id", currentPortId);
      formData.append("current_port_name", currentPortName);
      formData.append("last_port_id", lastPortId);
      formData.append("last_port_name", lastPortName);
      formData.append("destination_port_id", destinationPortId);
      formData.append("destination_port_name", destinationPortName);

      if (isSystemAdmin && imageFile) {
        formData.append("shipImage", imageFile);
      }

      const response = await fetch(`/api/ship/addShip`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        // setTimeout(() => navigate("/ships"), 2000);
        if (data.ship.ship_id && data.ship.current_port_id != null) {
          const shipPayload = { ship_id: data.ship.ship_id };
          const response = await fetch(`/api/port/dockShip/${portId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(shipPayload),
          });

          if (response.ok) {
            const data = await response.json()
            toast.success(data.message);

          } else {
            const data = await response.json();
            toast.error(data.message);
          }
        }
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to add ship.");
      }
    } catch (error) {
      toast.error(`Network error: ${error.message}`);
      // setError(`Network error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassNames = "mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-inner text-gray-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600";

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 flex items-start justify-center font-sans">
      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-xl lg:max-w-3xl transform transition-all duration-300 ring-4 ring-cyan-50/70">
        {isAdmin && (
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-cyan-700 tracking-tight">
            Dock Ship
          </h2>
        )}
        {isSystemAdmin && (
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-cyan-700 tracking-tight">
            Add Ship
          </h2>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* {(message || error) && <Message message={message} error={error} />} */}

          {/* Form fields ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Ship Name */}
            <div>
              <label htmlFor="shipName" className="block text-sm font-semibold text-gray-700 mb-1">
                Ship Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="shipName"
                id="shipName"
                value={shipData.shipName}
                onChange={handleChange}
                required
                placeholder="The Sea Serpent"
                className={inputClassNames}
              />
            </div>
            {/* Ship Type */}
            <div>
              <label htmlFor="shipType" className="block text-sm font-semibold text-gray-700 mb-1">
                Ship Type
              </label>
              <CustomDropdown
                name="shipType"
                options={['CARGO', 'TANKER', 'GENERAL']}
                selected={shipData.shipType}
                onSelect={handleDropdownChange('shipType')}
              />
            </div>
            {/* Max Storage Capacity */}
            <div>
              <label htmlFor="maxStorageCapacity" className="block text-sm font-semibold text-gray-700 mb-1">
                Max Storage Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxStorageCapacity"
                id="maxStorageCapacity"
                value={shipData.maxStorageCapacity}
                onChange={handleChange}
                required
                placeholder="e.g., 1000"
                className={inputClassNames}
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Remaining Storage Capacity
              </label>
              <input
                type="number"
                name="remainStorageCapacity"
                value={shipData.remainStorageCapacity}
                onChange={handleChange}
                className={inputClassNames}
                min={0}
              />
            </div>
            {/* Storage Unit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Storage Unit
              </label>
              <CustomDropdown
                options={["TONS", "M3", "TEU"]}
                selected={shipData.storageUnit}
                onSelect={handleDropdownChange("storageUnit")}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <CustomDropdown
                options={["DOCKED", "IN ROUTE", "MAINTENANCE", "OUT OF SERVICE"]}
                selected={shipData.status}
                onSelect={handleDropdownChange("status")}
              />
            </div>

            {/* Current Port ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Current Port ID
              </label>
              <input
                type="text"
                name="currentPortId"
                value={shipData.currentPortId || ""}
                onChange={handleChange}
                className={inputClassNames}
              />
            </div>

            {/* Current Port Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Current Port Name
              </label>
              <input
                type="text"
                name="currentPortName"
                value={shipData.currentPortName}
                onChange={handleChange}
                className={inputClassNames}
              />
            </div>

            {/* Last Port ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Last Port ID
              </label>
              <input
                type="text"
                name="lastPortId"
                value={shipData.lastPortId}
                onChange={handleChange}
                className={inputClassNames}
              />
            </div>

            {/* Last Port Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Last Port Name
              </label>
              <input
                type="text"
                name="lastPortName"
                value={shipData.lastPortName}
                onChange={handleChange}
                className={inputClassNames}
              />
            </div>

            {/* Destination Port ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Destination Port ID
              </label>
              <input
                type="text"
                name="destinationPortId"
                value={shipData.destinationPortId}
                onChange={handleChange}
                className={inputClassNames}
              />
            </div>

            {/* Destination Port Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Destination Port Name
              </label>
              <input
                type="text"
                name="destinationPortName"
                value={shipData.destinationPortName}
                onChange={handleChange}
                className={inputClassNames}
              />
            </div>
            {/* Ship Image */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Ship Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600
      file:mr-4 file:py-2 file:px-4
      file:rounded-lg file:border-0
      file:text-sm file:font-semibold
      file:bg-cyan-50 file:text-cyan-700
      hover:file:bg-cyan-100
      transition"
              />

              {shipData.imageFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {shipData.imageFile.name}
                </p>
              )}
            </div>

            {/* Remaining form fields omitted for brevity ... */}
          </div>

          {isSystemAdmin && (
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 mt-10 border border-transparent rounded-lg shadow-xl text-lg font-bold text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-cyan-600 disabled:bg-cyan-400 transition duration-300 transform hover:scale-[1.005] hover:shadow-2xl active:scale-[0.99]"
              disabled={isLoading}
            >
              Add Ship Now
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddShip;
