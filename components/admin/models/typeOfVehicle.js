const mongoose = require('mongoose');


const vehicleSchema = new mongoose.Schema({

    vehicle : { type: String, trim: true, default: "" },

})

const vehicleModel = mongoose.model('vehicle', vehicleSchema);

module.exports = vehicleModel;
