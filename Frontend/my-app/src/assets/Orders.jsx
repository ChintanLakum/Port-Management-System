import { useEffect , useState } from "react";
import { useSelector } from "react-redux";
import OrderCard from "./OrderCard";

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
            const response = await fetch(fetchUrl, {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            let ordersArray = Array.isArray(data) ? data : data.orders || [];
            setOrders(ordersArray);
            setError(null);

        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError("Failed to load orders. Please try again later.");
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