// User Schema
const mongoose = require('../../../index').mongoose;
const moment = require('moment');

// Point Schema for location ("Longitude and Latitude")

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point', 'LineString', 'Polygon' , 'MultiPoint', 'MultiLineString', 'MultiPolygon'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }

})

// User Schema for User Registration.

const userSchema=new mongoose.Schema({
    full_name: { type: String, trim: true },
    email: { type: String, trim: true , default: ""},
    password: { type: String, trim: true ,default:""},
    contact: { type: String, trim: true, default: ""},
    countryCode: { type: String, trim: true, default: ""},
    // isOtpVerified: { type: Boolean, default: false},
    isEmailVerified: { type: Boolean, default: false},
    profile_pic: { type: String, trim: true, default: ""},
    about : { type: String, trim: true, default: ""},
    designation : { type: String, trim: true, default: ""},
    languages : [String],
    accessToken: { type: String, trim: true ,default:""},
    login_type: { type: String, trim: true ,default:""},
    address_name:{type: String ,default:""},
    interests : [{id:{type:mongoose.Types.ObjectId,refer:'interests'},isSelect:{type:Boolean,default:true}}],
    vehicles : [{id : {type:mongoose.Types.ObjectId,refer:'vehicles'},isSelect:{type:Boolean,default:true}}],
    amenities : [{id : {type:mongoose.Types.ObjectId,refer:'amenities'},isSelect:{type:Boolean,default:true}}],
    device_modal:{type : String,default:""},
    device_Token: { type: String, trim: true, default: ""},
    device_type: { type: String, trim: true, default: ""},
    device_modal: { type: String, trim: true, default: ""},
    app_version: { type: String, trim: true, default: ""},
    // isOnline : {type:Boolean,default:true},
    location:pointSchema,
    about:{type: String, default:"" },
    radius : {type:Number,default:0},
    type : {type: String, default:""},
    timestamp: {
        type: String, 
        default: () => moment().format("MMMM Do YYYY")
    },
    identification : {type: Boolean, default:false},
    superHost : {type: Boolean, default:false},
});


userSchema.index({ "location": "2dsphere" });


const userModel=mongoose.model('user',userSchema);

module.exports=userModel;

