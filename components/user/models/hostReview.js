const mongoose = require('mongoose');

const userReviewSchema = new mongoose.Schema({
    hostId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    review : {
        type: String,
    },
    rating: {type: String},

    timestamp: {
        type: Date,
        default: Date.now
    }
    
})

const HostReviewModel = mongoose.model('HostReview', userReviewSchema);

module.exports = HostReviewModel;