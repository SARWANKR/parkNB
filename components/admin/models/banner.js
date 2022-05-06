const mongoose = require('mongoose');


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


const BannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image : [String],
    location : pointSchema,
})

BannerSchema.index({ "location": "2dsphere" });

const BannerModel = mongoose.model('Banner', BannerSchema);

module.exports = BannerModel;


