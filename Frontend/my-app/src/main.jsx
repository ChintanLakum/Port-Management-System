import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import Footer from "./components/Footer.jsx";
import Signup from "../src/pages/User/Signup.jsx"
import { Provider } from "react-redux";
import store from "./stores/index.js";
import "./style.css";
import ContactUs from "./components/Contact.jsx";
import { ToastContainer } from "react-toastify"
import { toast } from "react-toastify";

const Users =  lazy(() => import("./pages/User/Users.jsx"))
const Ports =  lazy(() => import("./pages/Port/Ports.jsx"))
const OrderDetails = lazy(() => import("./pages/Order/OrderDetail.jsx"))
const EditProfileForm = lazy(() => import("./pages/User/EditProfile.jsx"))
const Profile = lazy(() => import("./pages/User/Profile.jsx"))
const DockShip = lazy(() => import("./pages/Ship/DockShip.jsx"))
const UpdateShip = lazy(() => import("./pages/Ship/UpdateShip.jsx"))
const UpdatePort = lazy(() => import("./pages/Port/UpdatePort.jsx"))
const ShipDetails = lazy(() => import("./pages/Ship/ShipDetails.jsx"))
const AddShip = lazy(() => import("./pages/Ship/AddShip.jsx"))
const AddPort = lazy(() => import("./pages/Port/AddPort.jsx"))
const PortManagement = lazy(() => import("./pages/Port/PortManagement.jsx"))
const NewOrder = lazy(()=>import("./pages/Order/NewOrder.jsx"));
const Service = lazy(() => import("./components/Service.jsx"));
const Track = lazy(() => import("./pages/Order/Track.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const Login = lazy(() => import("./pages/User/Login.jsx"));
const PortDetails = lazy(() => import("./pages/Port/PortDetails.jsx"));
const ShipManagement = lazy(() => import("./pages/Ship/ShipManagement.jsx"));
const Orders = lazy(()=>import("./pages/Order/Orders.jsx"))

  // async function fetchData() {
  //     const response = await fetch("/api");
  //       const data = await response.json()
  //       console.log(data)
        
  //     if(data.success){
      
  //       toast.success(data.message)
  //     }
  //     else{
  //       toast.error(data.message)
  //     }
  // }
 
const App = ()=>{
  //  useEffect(()=>{
  //     fetchData()
  //  }, []);
   
  return(
     <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/track" element={<Track />} />
          <Route path="/service" element={<Service />} />
          <Route path="/ports" element={<PortManagement />} />
          <Route path="/addPort" element={<AddPort />} />
          <Route path="/portDetails/:portId" element={<PortDetails />} />
          <Route path="/ships" element={<ShipManagement />} />
          <Route path="/addShip" element={<AddShip />} />
          <Route path="/shipDetails/:shipId" element={<ShipDetails />} />
          {/* <Route path="/updateShip" element={<UpdateShip />} />
          <Route path="/updatePort" element={<UpdatePort />} /> */}
          <Route path="/dockShip" element={<DockShip />} />
          <Route path="/updateShip/:shipId" element={<UpdateShip />} />
          <Route path="/updatePort/:portId" element={<UpdatePort />} />
          <Route path="/newOrder"  element={<Ports />} />
          <Route path="/placeOrder" element={<NewOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/track/:orderId" element={< OrderDetails />}/>
          <Route path="/profile/:userId" element={<Profile/>} />
          <Route path="/editProfile/:userId" element={<EditProfileForm />}/>
          <Route path="/users" element={<Users />}> </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>
  </StrictMode>
  )
}
const root = createRoot(document.getElementById("root"));
root.render(<App />)

 