const mongoose = require('mongoose');
const crypto = require("crypto");
const shipSchema = new mongoose.Schema({
    ship_id: {
        type: String,
        unique: true,
    },
    ship_name: {
        type: String,
        required: true,
    },
    img_url: {
        type: String,
        default: "/public/ship17.jpg",
    },
    ship_type: {
        type: String,
        enum: ['GENERAL', 'CARGO', 'TANKER'],
        required: true,
        trim: true,
        default: "CARGO"
    },
    max_storage_capacity: {
        type: Number,
        required: true,
        min: 0,
    },
    storage_unit: {
        type: String,
        enum: ['TONS', 'M3', 'TEU'],
        required: true,
    },
    remain_storage_capacity: {
        type: Number,
        default: 0,
        min: 0,
    },
    status: {
        type: String,
        enum: ['DOCKED', 'IN ROUTE', 'MAINTENANCE', 'OUT OF SERVICE'],
        default: 'DOCKED',
        required: true,
    },
    current_port_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Port',
        default: null,
        required:false
    },
    current_port_name: {
        type: String,
        default: null,
        required:false
    },
    last_port_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Port',
    },
    last_port_name: {
        type: String,
        trim: true,
    },
    destination_port_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Port',
    },
    destination_port_name: {
        type: String,
        trim: true,
    },
    list_of_orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: [],
    }],
}, {
    timestamps: true,
});
shipSchema.pre("save", function (next) {
    const ship = this;
    if (ship.isNew && !ship.ship_id) {
        const ship_id = crypto.randomBytes(12).toString("hex");
        ship.ship_id = ship_id;
    }
    next();
})
shipSchema.virtual('isOverloaded').get(function () {
    return this.current_cargo_weight > this.max_storage_capacity;
});
const Ship = mongoose.model('Ship', shipSchema);
module.exports = Ship;