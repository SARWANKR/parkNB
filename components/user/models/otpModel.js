
// OTP Model
const mongoose=require('../../../index').mongoose;


const otpSchema = new mongoose.Schema({

    contact: {type: String, trim: true, default: ""},

    countryCode: {type: String, trim: true, default: ""},
    otp: { type: String, trim: true, default: "" },
    // status : { type: String, default: "0" },
    isOtpVerified: { type: Boolean, default: false},
    email:{type: String, trim: true, default: ""},
    // isEmailVerified: { type: Boolean, default: false},
    // type : { type: String, default: " " },
})


const otpModel=mongoose.model('otp',otpSchema);

module.exports=otpModel;


