const mongoose = require('mongoose');


const  chatModelSchema = new mongoose.Schema({
    senderId: {type : mongoose.Schema.Types.ObjectId, ref: 'user'},
    receiverId: {type : mongoose.Schema.Types.ObjectId, ref: 'user'},
    message: {type: String},
    seen : {type: Boolean, default: false},
    delivered : {type: Boolean, default: false},
})

const chatModel = mongoose.model('chat', chatModelSchema);
module.exports = chatModel;