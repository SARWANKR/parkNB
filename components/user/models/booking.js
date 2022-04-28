const mongoose = require('mongoose');


const bookingShema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    propertyId: { type: mongoose.Types.ObjectId, ref: 'property' },
    select_dates : {
        start_date : { type: String, default: " " },
        end_date : { type: String ,  default: " " },
    },
    status : { type: String, default: '0' }, // 0 for pending, 1 for confirmed request , 2 for cancelled , 3 for booking confirmed

    acceptedAt : { type: String, default: " " },
    dueDate : { type: String, default: " " },


});

const bookingModel = mongoose.model('booking', bookingShema);
module.exports = bookingModel;