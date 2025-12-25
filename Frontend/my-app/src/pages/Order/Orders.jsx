import { useEffect , useState } from "react";
import { useSelector } from "react-redux";
import OrderCard from "./OrderCard";
import { toast } from "react-toastify";


const Orders = (ship)=>{
    const shipId = ship.ship
    console.log(ship)
    const {userId, isLoggedIn , isSystemAdmin, isAdmin, portId} = useSelector(
      
        (state) =>
            state.auth
    )
    let fetchUrl = `/api/order/all/user/${userId}`
    if(shipId && isAdmin){
        fetchUrl =`/api/order/all/ship/${shipId}`
    }
    if(!shipId && isAdmin){
        fetchUrl =`/api/order/all/port/${portId}`
    }
    if(isLoggedIn && userId && !isAdmin && !isSystemAdmin){
        fetchUrl =`/api/order/all/user/${userId}`
    }
    if(isSystemAdmin && isLoggedIn ){
        fetchUrl = `/api/order/all`
    }
    const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        fetchOrders();
    }, [fetchUrl]);

    console.log(fetchUrl)
    const fetchOrders = async () => {
    try {
        toast.loading("Loading orders...", { toastId: "orders-loading" });

        const response = await fetch(fetchUrl, {
            method: "GET",
        });

        const data = await response.json();
        toast.dismiss("orders-loading");

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch orders");
        }

        let ordersArray = Array.isArray(data) ? data : data.orders || [];
        setOrders(ordersArray);
        setError(null);

        // ✅ Success toast (only once, not spammy)
        if (ordersArray.length > 0) {
            toast.success("Orders loaded successfully");
        } else {
            toast.info("No orders found");
        }

    } catch (err) {
        toast.dismiss("orders-loading");
        console.error("Failed to fetch orders:", err);

        setError("Failed to load orders. Please try again later.");
        toast.error("Failed to load orders");
    } finally {
        setLoading(false);
    }
};




    return(
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                gap-6 sm:gap-8 my-6 px-4 sm:px-6 max-w-7xl">
                {loading && <p className="md:col-span-4 text-center">Loading orders...</p>}
                {error && <p className="md:col-span-4 text-center text-red-500">{error}</p>}
                {!loading && !error && (
                    <>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <OrderCard key={order.order_id} order={order} />
                            ))
                        ) : (

                            orders.length < 0 && (
                                <p className="md:col-span-4 text-center">No orders found.</p>
                            )
                        )}
                    </>
                )}
            </div>)
}
 export default Orders;