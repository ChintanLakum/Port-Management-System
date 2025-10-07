const mongoose = require("mongoose");
const crypto = require("crypto");
const portSchema = new mongoose.Schema({
    port_name: {
        type: String,
        required: true,
    },
    port_id: {
        type: String,
        unique: true,
    },
    city: {
        type: String,
        require: true,
    },
    total_docks: {
        type: Number,
        required: true,
        default: 0,
    },
    available_ships: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'UNDER MAINTAINANCE', 'CLOSED'],
        default: 'ACTIVE',
    },
    img_url: {
        type: String,
        default: "/public/port10.jpg"
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    list_of_ships: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ship',
        default: [],
    }],
}, { timestamps: true });

portSchema.pre("save", function (next) {
    const port = this;
    if (port.isNew && !port.port_id) {
        const port_id = crypto.randomBytes(12).toString("hex");
        port.port_id = port_id;
    }
    next();
})
const Port = mongoose.model("Port", portSchema);
module.exports = Port;