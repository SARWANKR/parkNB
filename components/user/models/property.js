
// Add Property Schema

const mongoose  = require('mongoose');

const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point', 'Multipoint', 'Linestring', 'MultiLineString', 'Polygon', 'MultiPolygon'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  })


const propertySchema = new mongoose.Schema({

    userId:{type:mongoose.Types.ObjectId,refer:"user"},
    property_type : [{ type: mongoose.Schema.Types.ObjectId, ref: 'propertyType' }],
    add_title : { type: String, trim: true, default: "" },
    add_description : { type: String, trim: true, default: "" },
    amenities : [{ type: mongoose.Schema.Types.ObjectId, ref: 'amenities' }],
    country : { type: String, trim: true, default: "" },
    activities : [{ type: mongoose.Schema.Types.ObjectId, ref: 'activities' }],
    guests : {
        adults : { type: Number, default: " " },
        bedrooms : { type: Number, default: " " },
        washrooms : { type: Number, default: " " },
    },
    not_to_bring : [String],
    rules : { type: String, trim: true, default: "" },
    location : pointSchema,
    co_host : { type: Boolean, default: false },
    // govt_id : [String],
    pictures: [String],
    price : { 
        type: String,
        trim: true,
        default: ""
    },
    select_dates : {
        start_date : { type: String, default: " " },
        end_date : { type: String ,  default: " " },
    }

})

const propertyModel = mongoose.model('Addproperty', propertySchema);

module.exports = propertyModel;