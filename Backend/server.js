require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const {connectCloudinary} = require("./config/cloudinary.js")
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const shipRoutes = require('./routes/shipRoutes');
const portRoutes = require('./routes/portRoutes');
const connectDB = require("./middlewares/databaseConnection");
const systemAdminRoute = require('./routes/systemAdminRoutes');
const orderRoute = require('./routes/orderRoutes');
connectDB();
connectCloudinary()
//this is last touched-up file 
const app = express();

const distPath = path.join(__dirname, '../Frontend/my-app/dist');

app.use(express.static(distPath));
app.use(express.static('public'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())
app.use("/api/ship", shipRoutes);
app.use('/api/port', portRoutes);
app.use("/api/user", userRoutes);
app.use("/api/systemAdmin", systemAdminRoute);
app.use("/api/order", orderRoute)

const corsOption = {
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
}
app.get('/api', (req, res, next)=>{
    res.json({success:true, message: `Hello From Home Page`, })
})
app.get('/api/service', (req, res, next)=>{
    res.send({success:true, message:"Hello from service page"})
})


app.listen(5000);
