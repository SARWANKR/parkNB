const mongoose = require('mongoose');

const eventBookingSchema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,refer:"user"},
    eventId: { type: mongoose.Schema.Types.ObjectId, refer: "event" },
    status : { type: String, default: '0' }, // 0 for pending, 1 for confirmed, 2 for cancelled



})

const eventBookingModel = mongoose.model('eventBooking', eventBookingSchema);
module.exports = eventBookingModel;