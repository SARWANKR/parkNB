const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addproperties',
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

const PropertyReviewModel = mongoose.model('PropertyReview', reviewSchema);

module.exports = PropertyReviewModel;