const mongoose = require('mongoose');

const feedBackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title : {
        type: String,
        trim: true,
        default: ""
    },

    description : {
        type: String,
        trim: true,
        default: ""
    },

    
})

const feedBackModel = mongoose.model('feedback', feedBackSchema);

module.exports = feedBackModel;