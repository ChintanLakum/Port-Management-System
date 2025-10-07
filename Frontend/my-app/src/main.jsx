import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Header from "./assets/Header.jsx";
import Home from "./assets/Home.jsx";
import Footer from "./assets/Footer.jsx";
import Signup from "./assets/Signup.jsx";
import { Provider } from "react-redux";
import store from "./stores/index.js";
import "./style.css";
import ContactUs from "./assets/Contact.jsx";

const Users =  lazy(() => import("./assets/Users.jsx"))
const Ports =  lazy(() => import("./assets/Ports.jsx"))
const OrderDetails = lazy(() => import("./assets/OrderDetail.jsx"))
const EditProfileForm = lazy(() => import("./assets/EditProfile.jsx"))
const Profile = lazy(() => import("./assets/Profile.jsx"))
const DockShip = lazy(() => import("./assets/DockShip.jsx"))
const UpdateShip = lazy(() => import("./assets/UpdateShip.jsx"))
const UpdatePort = lazy(() => import("./assets/UpdatePort.jsx"))
const ShipDetails = lazy(() => import("./assets/ShipDetails.jsx"))
const AddShip = lazy(() => import("./assets/AddShip.jsx"))
const AddPort = lazy(() => import("./assets/AddPort.jsx"))
const PortManagement = lazy(() => import("./assets/PortManagement.jsx"))
const NewOrder = lazy(()=>import("./assets/NewOrder.jsx"));
const Service = lazy(() => import("./assets/Service.jsx"));
const Track = lazy(() => import("./assets/Track.jsx"));
const About = lazy(() => import("./assets/About.jsx"));
const Login = lazy(() => import("./assets/Login.jsx"));
const PortDetails = lazy(() => import("./assets/PortDetails.jsx"));
const ShipManagement = lazy(() => import("./assets/ShipManagement.jsx"));
const Orders = lazy(()=>import("./assets/Orders.jsx"))
async function fetchData() {
    const response = await fetch("/api");
    if(response.ok){
     const data = await response.json()
      console.log(data.message)
    }
}
 
const App = ()=>{
   useEffect(()=>{
      fetchData()
   }, []);
   
  return(
     <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
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
          <Route path="updateShip" element={<UpdateShip />} />
          <Route path="/updatePort" element={<UpdatePort />} />
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

 