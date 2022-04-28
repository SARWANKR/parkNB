const mongoose = require('mongoose');

const adminAmenitiesSchema = new mongoose.Schema({

    amenities : { type: String, default: "" },

    travel_radius : { type: String, default: "" },

})

const adminAmenitiesModel = mongoose.model('adminAmenities', adminAmenitiesSchema);

module.exports = adminAmenitiesModel;