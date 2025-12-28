import { useState } from "react";
import CustomDropdown from "../../components/CustomDropdown";
import { useNavigate } from "react-router-dom";
import Message from "../../components/Message";
import { toast } from "react-toastify";
const AddPort = () => {
  const [portData, setPortData] = useState({
    name: "",
    adminId: "",
    city: "",
    status: "ACTIVE",
    totalDocks: "",
    availableShips: "",
    image: null,
  });

  // const [message, setMessage] = useState("");
  // const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setPortData((prevData) => ({
        ...prevData,
        image: e.target.files[0],
      }));
    }
  };


  const handleStatusChange = (value) => {
  setPortData((prev) => ({
    ...prev,
    status: value,
  }));
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  // setError("");
  setIsLoading(true);

  const { name, city, status, totalDocks, adminId, image, availableShips } = portData;

  if (!name || !city || !totalDocks || !availableShips) {
    toast.warning("Please fill all required fields");
    setIsLoading(false);
    return;
  }

  const toastId = toast.loading("Adding new port...");

  try {
    const formData = new FormData();
    formData.append("port_name", name);
    formData.append("city", city);
    formData.append("status", status);
    formData.append("admin_id", adminId);
    formData.append("total_docks", totalDocks);
    formData.append("available_ships", availableShips);

    if (image) {
      formData.append("portPhoto", image);
    }

    const response = await fetch("/api/port/addPort", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    toast.dismiss(toastId);

    if (!response.ok) {
      throw new Error(data.message || "Failed to add port");
    }

    toast.success(data.message || "Port added successfully");

    setTimeout(() => navigate("/"), 1200);

  } catch (error) {
    toast.dismiss(toastId);
    console.error("Error adding port:", error);
    toast.error(error.message || "Network error occurred");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-cyan-700">
          Add New Port
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* {(message || error) && <Message message={message} error={error} />} */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Port Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={portData.name}
              onChange={(e)=>handleChange(e)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label
              htmlFor="adminId"
              className="block text-sm font-medium text-gray-700"
            >
              Admin ID
            </label>
            <input
              type="text"
              name="adminId"
              id="adminId"
              value={portData.adminId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={portData.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Status
            </label>
            <CustomDropdown
                  options={['ACTIVE', 'UNDER MAINTAINANCE', 'CLOSED']}
                  selected={portData.status}
                  onSelect={handleStatusChange}
                />
          </div>

          <div>
            <label
              htmlFor="totalDocks"
              className="block text-sm font-medium text-gray-700"
            >
              Total Docks
            </label>
            <input
              type="number"
              name="totalDocks"
              id="totalDocks"
              value={portData.totalDocks}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          <div>
            <label
              htmlFor="availableShips"
              className="block text-sm font-medium text-gray-700"
            >
              Available Ships
            </label>
            <input
              type="number"
              name="availableShips"
              id="availableShips"
              value={portData.availableShips}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Port Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleImageChange}
              required
              className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-cyan-100 file:text-cyan-700
              hover:file:bg-cyan-200"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-cyan-400"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Add Port"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPort