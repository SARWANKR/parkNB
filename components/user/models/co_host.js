const mongoose = require('mongoose');
const moment = require('moment');

const coHostShema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    propertyId: { type: mongoose.Types.ObjectId, ref: 'property' },
    // eventId: { type: mongoose.Types.ObjectId, ref: 'event' },
    // status: { type: String, default: 'pending' },
    timestamp: {
        type: String,
        default: () => moment().format("MMMM Do YYYY")
    }
});

const coHostModel = mongoose.model('coHost', coHostShema);

module.exports = coHostModel;
