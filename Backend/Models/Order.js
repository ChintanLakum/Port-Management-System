const mongoose = require('mongoose');
const crypto = require("crypto");
const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        unique: true,
    },
    ship_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ship',
        required: true,
    },
    ship_name:{
        type: String,
        trim: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    current_port_name: {
        type: String,
        trim: true,
    },
    current_port_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Port',
        required: true,
    },
    destination_port_name: {
        type: String,
        trim: true,
    },
    destination_port_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Port',
        required: true,
    },
    status: {
        type: String,
        enum: ['DEPARTURED', 'IN ROUTE', 'ARRIVED', 'LOST', "PENDING"],
        default: 'DEPARTURED',
        required: true,
    },
    storage: {
        type: Number,
        required: true,
        min: 0,
    },
    storage_unit: {
        type: String,
        enum: ['TONS', 'M3', 'TEU'],
        required: true,
    },
    payment_id: {
        type: String,
        unique: true,
        sparse: true,
        required: false
    },
}, {
    timestamps: true,
});
orderSchema.pre("save", function (next) {
    const order = this;
    if (order.isNew && !order.order_id) {
        const order_id = crypto.randomBytes(12).toString("hex");
        order.order_id = order_id;
    }
    next();
})

orderSchema.pre("save", function (next) {
    const order = this;
    if (order.isNew && !order.payment_id) {
        const payment_id = crypto.randomBytes(12).toString("hex");
        order.payment_id = payment_id;
    }
    next();
})

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;