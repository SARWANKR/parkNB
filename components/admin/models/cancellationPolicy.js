const mongoose = require('mongoose');


const cancellationPolicySchema = new mongoose.Schema({

    cancellation_policy : { type: String, trim: true, default: "" },

})

const cancellationPolicyModel = mongoose.model('cancellationPolicy', cancellationPolicySchema);

module.exports  = cancellationPolicyModel;