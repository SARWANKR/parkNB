// const mongoose = require('mongoose');
const mongoose = require('../../../index').mongoose;


const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point','Multipoint', 'Linestring', 'MultiLineString', 'Polygon', 'MultiPolygon'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const eventSchema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,refer:"user"},
    eventId: { type: mongoose.Schema.Types.ObjectId },
    event_name : { type: String, trim: true, default: "" },
    event_description : { type: String, trim: true, default: "" },
    event_Picture : [String],
    event_location : pointSchema,
    event_date : { type: String, trim: true, default: "" },
    // event_end_date : { type: String, trim: true, default: "" },
    event_time : { type: String, trim: true, default: "" },
    // event_end_time : { type: String, trim: true, default: "" },
    event_Adress : { type: String, trim: true, default: "" },
    event_price : { type: String, trim: true, default: "" },
})

eventSchema.index({ "event_location": "2dsphere" });

const eventModel = mongoose.model('event', eventSchema);
module.exports = eventModel;