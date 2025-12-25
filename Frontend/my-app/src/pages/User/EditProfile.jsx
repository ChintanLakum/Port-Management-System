import { useState, useEffect } from "react";
import { MdEmail, MdPhone, MdWork, MdAccountCircle } from 'react-icons/md';
import { useLocation, useParams } from "react-router-dom";
import CustomDropdown from "../../components/CustomDropdown";
import { toast } from "react-toastify";


const EditProfile = ({ onSave, onCancel }) => {
    const { userId } = useParams()
    console.log(userId)
    const location = useLocation()
    const user = location.state?.user
    const [formData, setFormData] = useState({});
    useEffect(() => {
        if (user && Object.keys(user).length > 0) {
            setFormData(user);
        }
    }, [user]);
    const [isSaving, setIsSaving] = useState(false);
    console.log("user", user, "formData", formData)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        setIsSaving(true);

        try {
            const bodyContent = JSON.stringify({ ...formData });

            const responce = await fetch(`/api/user/${userId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: bodyContent,
            });

            const data = await responce.json()
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
                console.error("Cannot save: user object is undefined.");
            }
        } catch (error) {
            toast.error(error.message)
        }



        setIsSaving(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-cyan-600 overflow-hidden">
                <div className="p-6 sm:p-10">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3">Edit Profile: {user?.name || 'Loading...'}</h2>
                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                            {/* Icon components replaced with Md* names */}
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    <MdAccountCircle className="w-4 h-4 inline-block mr-1 text-cyan-600" />
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-cyan-600 focus:border-cyan-600 transition duration-150 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    <MdEmail className="w-4 h-4 inline-block mr-1 text-cyan-600" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-cyan-600 focus:border-cyan-600 transition duration-150 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="mobileno" className="block text-sm font-medium text-gray-700 mb-1">
                                    <MdPhone className="w-4 h-4 inline-block mr-1 text-cyan-600" />
                                    Mobile No
                                </label>
                                <input
                                    type="tel"
                                    id="mobileno"
                                    name="mobileno"
                                    value={formData.mobileno}
                                    onChange={handleChange}
                                    placeholder="Mobile No"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-cyan-600 focus:border-cyan-600 transition duration-150 shadow-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-900 mb-2">
                                    <MdWork className="w-4 h-4 inline-block mr-1 text-cyan-600 " />
                                    Role
                                </label>
                                <CustomDropdown
                                    options={["USER", "ADMIN", "SYSTEM ADMIN"]}
                                    selected={formData.role}
                                    onSelect={handleDropdownChange('role')}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 pt-4 border-t mt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isSaving}
                                className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-xl shadow-md hover:bg-cyan-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSaving ? (
                                    <>
                                        {/* Placeholder for spinner as MdSync requires react-icons/md too */}
                                        <div className="w-5 h-5 mr-2 animate-pulse rounded-full border-2 border-white border-t-transparent"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
