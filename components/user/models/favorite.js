const mongoose = require('mongoose');


const favoriteSchema = new mongoose.Schema({

    userId: {type: mongoose.Schema.Types.ObjectId , ref: 'user', required: true},
    propertyId: {type: mongoose.Schema.Types.ObjectId , ref: 'property', required: true},
    property_type :{type: String},
    // type : {type: String},

})

const favoriteModel = mongoose.model('favorite', favoriteSchema);
module.exports = favoriteModel;