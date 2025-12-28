import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {
    const userId = user._id;
    const userName = user.name;
    const userEmail = user.email || "No Email Provided";
    const userRole = user.role || "Standard User";
    const userMobile = user.mobileno || "N/A";
    const lastLoggedIn = user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A";
    const defaultPortId = user.portId || "N/A"; 

    const navigate = useNavigate();

    return (
        <div
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 w-full sm:max-w-sm lg:max-w-md mx-auto m-6 flex flex-col transform transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:shadow-cyan-400/50 cursor-pointer overflow-hidden"
            onClick={() => navigate(`/profile/${userId}`)}
        >
            <div className="relative p-6 pb-2 bg-cyan-700 text-white rounded-t-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-extrabold truncate drop-shadow-md">
                        {userName || "Unknown User"}
                    </h3>
                    <span className="inline-block px-4 py-1 rounded-full text-sm font-bold bg-cyan-500/80 text-white shadow-md self-start border border-cyan-300">
                        {userRole}
                    </span>
                </div>
                <p className="text-cyan-100 text-sm font-light mb-1">User ID: <span className="font-medium">{userId}</span></p>
                <p className="text-cyan-100 text-sm font-light mb-1">Email: <span className="font-medium">{userEmail}</span></p>
                <p className="text-cyan-100 text-sm font-light">Mobile No: <span className="font-medium">{userMobile}</span></p> {/* Added Mobile No. */}
            </div>

            <div className="p-6 flex flex-col justify-between flex-grow">
                <div className="space-y-4 text-sm text-gray-700">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Last Logged In:</span>
                        <span className="font-semibold text-cyan-800">{lastLoggedIn}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                        <p className="flex flex-col">
                            <span className="font-medium text-gray-600">Default Port ID:</span>
                            <span className="font-semibold text-cyan-800 text-base mt-0.5">{defaultPortId}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500 rounded-b-2xl">
                Click to view full user profile
            </div>
        </div>
    );
};

export default UserCard;