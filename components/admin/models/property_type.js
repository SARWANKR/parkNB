const mongoose = require('mongoose');

const propertyTypeSchema = new mongoose.Schema({
    property_type : { type: String, trim: true, default: "" },
})

const propertyTypeModel = mongoose.model('propertyType' , propertyTypeSchema);

module.exports = propertyTypeModel;