const mongoose = require('mongoose');

const confirmedBookingSchema = new mongoose.Schema({

    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    propertyId: { type: mongoose.Types.ObjectId, ref: 'property' },
    select_dates : {
        start_date : { type: String, default: " " },
        end_date : { type: String ,  default: " " },
    },
    // status : { type: String, default: '0' }, // 0 for pending, 1 for confirmed request , 2 for cancelled , 3 for booking confirmed

});

const confirmedBookingModel = mongoose.model('confirmedBooking', confirmedBookingSchema);
module.exports = confirmedBookingModel;