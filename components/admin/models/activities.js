const mongoose = require('mongoose');

const activitiesSchema = new mongoose.Schema({
    
    activities : { type: String, trim: true, default: "" },

})

const activitiesModel = mongoose.model('activities', activitiesSchema);

module.exports = activitiesModel;