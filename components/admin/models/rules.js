const mongoose = require('mongoose');

const rulesSchema = new mongoose.Schema({

    rules : { type: String, trim: true, default: "" },
})

const rulesModel = mongoose.model('rules', rulesSchema);

module.exports = rulesModel;