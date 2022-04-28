const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
    interests : { type: String, trim: true, default: "" },
})

const interestModel = mongoose.model('interests', interestSchema);

module.exports = interestModel;