import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdEmail, MdPhone, MdWork, MdDateRange, MdAccountCircle, MdSync } from 'react-icons/md';
import { useSelector } from "react-redux";


const Profile = () => {
    const { userId } = useParams()
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const { isLoggedIn, isAdmin, isSystemAdmin } = useSelector((state) => state.auth)

    const navigate = useNavigate();

    const handleEditProfile = (user) => {
        console.log(user)
        navigate(`/editProfile/${userId}`, {
            state: {
                user: user,
            }
        })
    }


     const handleRemoveUser = async () => {
            if (!window.confirm(`Are you sure you want to permanently delete user ${userId}?`)) {
                return;
            }
            try {
                const responce = await fetch(`/api/user/${userId}`,
                    {
                        method: "DELETE",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });
                if (responce.ok) {
                    if (responce.status === 204) {
                        console.log(`User ${userId} deleted successfully (204 No Content).`);
                        setTimeout(() => setMessage("Redirecting to Home Page "), 1000);
                        setTimeout(() => navigate("/"), 1400);
                        setError(null)
                    } else {
                        const data = await responce.json();
                        console.log(`User ${userId} deleted successfully.`, data);
                    }

                }
                else if (responce.status === 404) {
                    console.error(`Error: User ${userId} not found.`);

                } else {
                    const errorData = await responce.text();
                    console.error("Failed to delete port:", errorData.message || responce.statusText);
                }
            } catch (error) {
                console.error("Network error during port deletion:", error);

            }
            finally {
                console.log("User removal attempt finished.");
            }
        }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const responce = await fetch(`/api/user/${userId}`)
                if (responce.ok) {
                    const data = await responce.json();
                    setUser(data.user)
                } else {
                    console.log(`Failed to fetch user. Status: ${responce.status}`)
                }
            } catch (error) {
                console.log("Error fetching user: ", error)
            }
            finally {
                console.log("user fetched ", user)
            }
        }

        fetchUser();
    }, [userId]);
    const DetailItem = ({ icon: IconComponent, label, value }) => (
        <div className="flex items-start space-x-4 border-b border-gray-100 py-3">
            <div className="text-cyan-500 pt-1 flex-shrink-0">
                <IconComponent className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <span className="text-base font-semibold text-gray-800 break-words">{value}</span>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl border border-gray-200">
                    {/* Used MdSync and added animate-spin for a spinner */}
                    <MdSync className="w-8 h-8 text-cyan-500 mb-3 animate-spin" />
                    <p className="text-xl font-semibold text-gray-700">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-xl font-semibold text-red-600 p-8 bg-white rounded-xl shadow-xl border border-red-200">
                    User profile not found for ID: {user._id}.
                </div>
            </div>
        )
    }

    const BACKEND_BASE_URL = 'http://localhost:5000';
    const userImage = `${BACKEND_BASE_URL}${user.imgUrl}`;
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-cyan-100 overflow-hidden">

                {/* Header & Photo */}
                <div className="bg-cyan-600 p-8 sm:p-10 flex flex-col items-center text-white">
                    <img
                        src={userImage}
                        alt={`${user.name}'s Profile`}
                        className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg mb-4 transform hover:scale-105 transition duration-300"
                        // Fallback image source in case the placeholder fails
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/10b981/ffffff?text=User" }}
                    />
                    <h1 className="text-3xl font-extrabold tracking-tight mt-2">{user.name}</h1>
                    <p className="text-xl font-medium opacity-80 mt-1">{user.role}</p>
                </div>

                {/* Content Grid */}
                <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                    {/* Left Column: Contact Details */}
                    <div className="md:border-r md:pr-6 space-y-2">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Contact Information</h2>

                        <DetailItem
                            icon={MdEmail}
                            label="Email Address"
                            value={user.email}
                        />
                        <DetailItem
                            icon={MdPhone}
                            label="Mobile Number"
                            value={user.mobileno}
                        />
                        <DetailItem
                            icon={MdWork}
                            label="Role/Title"
                            value={user.role}
                        />
                    </div>

                    {/* Right Column: Bio and Additional Details */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">About</h2>

                        <DetailItem
                            icon={MdDateRange} // Using MdDateRange
                            label="Joined Platform"
                            value={new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        />
                        <DetailItem
                            icon={MdAccountCircle} // Using MdAccountCircle
                            label="Profile ID"
                            value={userId}
                        />
                        {isAdmin && isLoggedIn && (<DetailItem
                            icon={MdAccountCircle}
                            label="User ID"
                            value={user.userId}
                        />)}

                    </div>
                </div>

                {/* Footer/Action Section */}
                {isLoggedIn && !isSystemAdmin && <div className="bg-gray-50 p-6 flex justify-center border-t border-cyan-100">
                    <button
                        onClick={() => handleEditProfile(user)}
                        className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-xl shadow-md hover:bg-cyan-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Edit Profile
                    </button>
                </div>}
                {isSystemAdmin && (
                    <div className="bg-gray-50 p-6 flex justify-center border-t border-cyan-100">
                        <button
                            onClick={() => handleRemoveUser(user)}
                            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Remove User
                        </button>
                    </div>)
                }

            </div>
        </div>
    );
};

export default Profile;