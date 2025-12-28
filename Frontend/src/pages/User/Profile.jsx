import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdEmail, MdPhone, MdWork, MdDateRange, MdAccountCircle, MdSync } from 'react-icons/md';
import { GiAnchor } from "react-icons/gi";
import { useSelector } from "react-redux";

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const { isLoggedIn, isSystemAdmin, } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/user/${userId}`, { credentials: 'include' });
                if (!response.ok) throw new Error(`Failed to fetch user with ID ${userId}`);
                const data = await response.json();
                console.log(data.user)
                setUser(data.user);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleEditProfile = () => {
        navigate(`/editProfile/${userId}`, { state: { user } });
    };

    const handleRemoveUser = async () => {
        if (!window.confirm(`Are you sure you want to permanently delete user ${user.name}?`)) return;
        try {
            const res = await fetch(`/api/user/${userId}`, {
                method: "DELETE",
                credentials: 'include'
            });
            if (!res.ok) throw new Error(`Failed to delete user ${user.name}`);
            setMessage("User removed successfully. Redirecting...");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <MdSync className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <p className="text-red-600 font-bold">{error}</p>
                </div>
            </div>
        );
    }

    const DetailItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start space-x-4 border-b border-gray-100 py-3">
            <div className="text-cyan-500 pt-1 flex-shrink-0">
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-base font-semibold text-gray-800 break-words">{value}</span>
            </div>
        </div>
    );


    const showUpdateButton = 
        (!isSystemAdmin && isLoggedIn) ||
        (isSystemAdmin && user.role === "SYSTEM ADMIN"); 

    const showRemoveButton = 
        isSystemAdmin && user.role !== "SYSTEM ADMIN"; 

    console.log(user)
    const userImage = user.imgUrl
    console.log(userImage)
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-cyan-100 overflow-hidden">

                {/* Header & Photo */}
                <div className="bg-cyan-600 p-8 sm:p-10 flex flex-col items-center text-white">
                    <img
                        src={userImage}
                        alt={`${user.name}'s Profile`}
                        className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg mb-4 transform hover:scale-105 transition duration-300"
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
                        <DetailItem icon={MdEmail} label="Email Address" value={user.email} />
                        <DetailItem icon={MdPhone} label="Mobile Number" value={user.mobileno} />
                        <DetailItem icon={MdWork} label="Role/Title" value={user.role} />
                    </div>

                    {/* Right Column: Additional Info */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">About</h2>
                        <DetailItem icon={MdDateRange} label="Joined Platform" value={new Date(user.createdAt).toLocaleDateString()} />
                        <DetailItem icon={MdAccountCircle} label="Profile ID" value={user._id} />
                        {user.portId && <DetailItem icon={GiAnchor} label="Port ID" value={user.portId} />}
                    </div>
                </div>

                {/* Footer Actions */}
                {(showUpdateButton || showRemoveButton) && (
                    <div className="bg-gray-50 p-6 flex justify-center border-t border-cyan-100 space-x-4">
                        {showRemoveButton && (
                            <button
                                onClick={handleRemoveUser}
                                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 transition duration-300"
                            >
                                Remove User
                            </button>
                        )}
                        {showUpdateButton && (
                            <button
                                onClick={handleEditProfile}
                                className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-xl shadow-md hover:bg-cyan-700 transition duration-300"
                            >
                                Update Profile
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
