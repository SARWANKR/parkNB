const mongoose = require('mongoose');

const govtIdSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    type: {
        type: String,
        enum: ['Driving Licence', 'Identity Card', 'Passport'],
    },
    govternmentId: [String]


})

const govtIdModel = mongoose.model('govtId', govtIdSchema);

module.exports = govtIdModel;