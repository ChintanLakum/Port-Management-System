const mongoose = require('mongoose');
const mongoUrl = process.env.MONGO_URI; // CORRECTED variable name

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoUrl);

        console.log('MongoDB connected');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
