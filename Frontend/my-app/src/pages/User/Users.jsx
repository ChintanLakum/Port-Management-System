import UserCard from "./UserCard";
import { useState, useEffect } from "react";

const Users = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/user/all", {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            let userArray = Array.isArray(data) ? data : data.users || [];
            setUsers(userArray);
            setError(null);

        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Failed to load users. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                gap-6 sm:gap-8 my-6 px-4 sm:px-6 max-w-7xl">
            {loading && <p className="md:col-span-4 text-center">Loading users...</p>}
            {error && <p className="md:col-span-4 text-center text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <UserCard key={user._id} user={user} />
                        ))
                    ) : (
                        users.length < 0 && (
                            <p className="md:col-span-4 text-center">No users found.</p>
                        )
                    )}
                </>
            )}
        </div>)
}

export default Users