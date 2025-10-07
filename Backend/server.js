require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const shipRoutes = require('./routes/shipRoutes');
const portRoutes = require('./routes/portRoutes');
const connectDB = require("./databaseConnection");
const systemAdminRoute = require('./routes/systemAdminRoutes');
const orderRoute = require('./routes/orderRoutes');

connectDB();

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
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD", // Corrected 'METHODS' to 'methods'
    credentials: true,
}
app.get('/api', (req, res, next)=>{
    res.status(200).json({ message: `Hello From Home Page`,data:"Hello From Home Page" })
})
app.get('/api/service', (req, res, next)=>{
    res.send("hello from service page")
})


app.listen(5000);
