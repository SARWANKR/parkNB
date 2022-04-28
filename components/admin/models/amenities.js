const mongoose = require('mongoose');

const amenitiesSchema = new mongoose.Schema({
    amenities : { type: String, trim: true, default: "" },
})

const amenitiesModel = mongoose.model('amenities', amenitiesSchema);

module.exports = amenitiesModel;