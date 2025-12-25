import Message from "../../components/Message";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";



const UpdatePort = () => {
    const { portId } = useParams();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [isConfirming, setIsConfirming] = useState(false);
    const port = location.state?.port;
    const [formData, setFormData] = useState(port || {});
    const { isLoggedIn, isAdmin, isSystemAdmin } = useSelector(
        (state) => state.auth
    );
    useEffect(() => {
        if (port && Object.keys(port).length > 0) {
            setFormData(port);
        }
    }, [port, portId]);

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
        toast.info("Port update canceled.");
    };

    const handleConfirmUpdate = async () => {
        setIsConfirming(false);
        setIsLoading(true);

        if (!formData.port_id) {
            setError("Cannot update. Port data is missing an ID.");
            toast.error("Port ID is missing. Update failed.");
            setIsLoading(false);
            return;
        }

        try {
            const dataToSend = { ...formData };
            delete dataToSend.imageFile;

            const response = await fetch(`/api/port/updatePort/${portId}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const data = await response.json();
                if (response.status === 204) {
                    toast.success(data.message||`Port ${portId} updated successfully!`);
                } else {
                    toast.success(data.message);
                }
            } else if (response.status === 404) {
                const data = await response.json();
                toast.error(data.message);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Network error during port updation:", error);
            toast.error(`Network error: ${error.message}`);
        } finally {
            setIsLoading(false);
            if (isSystemAdmin) {
                navigate("/ports");
            } else if (isAdmin) {
                navigate("/ships");
            }
        }
    };


    console.log("formData", formData);
    const inputClassNames = "mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-inner text-gray-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600";
    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8 flex items-start justify-center font-sans">
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-xl lg:max-w-3xl transform transition-all duration-300 ring-4 ring-cyan-50/70">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-cyan-700 tracking-tight">
                    Update Port
                </h2>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {(message || error) && <Message message={message} error={error} />}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Port Name */}
                        <div>
                            <label htmlFor="port_name" className="block text-sm font-semibold text-gray-700 mb-1">
                                Port Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="port_name"
                                id="port_name"
                                value={formData.port_name || ""}
                                onChange={handleChange}
                                required
                                placeholder="The Sea Serpent"
                                className={inputClassNames}
                            />
                        </div>
                        <div>
                            <label htmlFor="port_id" className="block text-sm font-semibold text-gray-700 mb-1">
                                Port ID
                            </label>
                            <input
                                type="text"
                                name="port_id"
                                id="port_id"
                                value={formData.port_id || ''}
                                onChange={handleChange}
                                placeholder="P-ABC"
                                className={inputClassNames}
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                value={formData.city || ""}
                                onChange={handleChange}
                                required
                                placeholder="Mumbai"
                                className={inputClassNames}
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
                                Port Type
                            </label>
                            <CustomDropdown
                                name="status"
                                options={['ACTIVE', 'UNDER MAINTAINANCE', 'CLOSED']}
                                selected={formData.status || 'CARGO'}
                                onSelect={handleDropdownChange('status')}
                            />
                        </div>


                        <div>
                            <label htmlFor="total_docks" className="block text-sm font-semibold text-gray-700 mb-1">
                                Total Docks <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="total_docks"
                                id="total_docks"
                                value={formData.total_docks || ''}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 1000"
                                className={inputClassNames}
                                min={1}
                            />
                        </div>
                        <div>
                            <label htmlFor="available_ships" className="block text-sm font-semibold text-gray-700 mb-1">
                                Available Ships <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="available_ships"
                                id="available_ships"
                                value={formData.available_ships || ''}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 1000"
                                className={inputClassNames}
                                min={0}
                            />
                        </div>

                        {/* Admin Id */}
                        <div>
                            <label htmlFor="admin_id" className="block text-sm font-semibold text-gray-700 mb-1">
                                Admin ID
                            </label>
                            <input
                                type="text"
                                name="admin_id"
                                id="admin_id"
                                value={formData.admin_id || ''}
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
                                Upload Port Photo
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
                                Updating Port...
                            </>
                        ) : "Update Port Now"}
                    </button>
                </form>
            </div>


            {isConfirming && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full transform transition-all duration-300 scale-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Update</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to update Port **{portId}**?
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

export default UpdatePort