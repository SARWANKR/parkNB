
const logger = require("../../config/logger");
const amenitiesModel = require("./models/amenities")
const activitiesModel = require('./models/activities')
const propertyTypeModel = require('./models/property_type')
const interestModel = require('./models/interesttedIn')
const vehicleModel = require('./models/typeOfVehicle')
const adminAmenitiesModel = require('./models/adminAmenities')
const cancellationPolicyModel = require('./models/cancellationPolicy')
const rulesModel = require('./models/rules')
const adminModel = require('./models/admin')
// const notToBringModel = require('./models/notToBring')
const commonfunction = require("../commonfunctions");
const messages = require("../commonfunctions").customMessages();
const lib = require("../../index");
const { mongoose } = require("../../index");
const env = require("../../env");
const appCred = require("../../config/appCredentials")[env.instance];
const path = require("path");

module.exports = {
 
// Admin login
login:async(req,res)=>{
  var body=req.body
  console.log(body,"Login")
  var admin = await adminModel.findOne({email:body.email})
  if(admin && body.password){
      const validPassword = await lib.bcrypt.compareSync(body.password, admin.password);
      if (validPassword) {
          const token=lib.jwt.sign({email:body.email},process.env.JWT_SECRET);
          try {
              var updateUser=await adminModel.findByIdAndUpdate({_id:admin._id},{accessToken:token});
              console.log(token,"token")
          } catch (e) {
              logger.error(e),
              res.json({status:false,code:201,message:messages.ANNONYMOUS});
          }
          const finalResponse={
              adminId:updateUser._id,
              admin:updateUser.email,
              accessToken:token
          }
          const response=commonfunction.checkRes(finalResponse);
          response.message=messages.LOGIN;
          logger.info(`${req.url},${req.method}:${req.hostname},${JSON.stringify(response.status)}`)
          res.status(200).send(response);
      } else {
          res.status(201).send({status:false,code:201,message:messages.NOT_MATCHED});
      }
  }
},

// Add Admin

   createAdmin:async(req,res)=>{
        var body=req.body
       var  password="admin@123";
        try {
            lib.bcrypt.genSalt(10, function(err, salt) {
                lib.bcrypt.hash(password, salt, async(err, hash)=> {
                    if(err){
                        logger.error(err)
                    }
                    // admin.password=hash;
                    var admin=new adminModel({
                        email:body.email,
                        password:hash
                    })
                    var newAdmin=await admin.save();
                    let response = commonfunction.checkRes(newAdmin);
                    response.message="admin created successfully"
                    logger.info(`${req.url},${req.method},${req.hostname},${JSON.stringify(response.status)}`);
                    res.status(200).send(response);
                });
            })
        } catch (e) {
            logger.error(e);
            return res.json({status:false,code:201,message:messages.ANNONYMOUS})
        }
    },


    


    // Add  Amenities
    addamenities: async (req, res) => {

      var body = req.body;
      console.log(body, "fsdhfgsdykfgsdhfgsdjkf");
      try {
        var data = {
          amenities : body.amenities,
        }
        var amenities =  new  amenitiesModel(data);
        await amenities.save();
        res.status(200).json({status: true, message: messages.SUCCESS, data: data});
      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }

    },

    // Update Amenities

    updateamenities: async (req, res) => {
        
        var body = req.body;
        try {
          var data = {
            amenities : body.amenities,
          }
          var amenities =  await amenitiesModel.findOneAndUpdate({_id:body.amenitiesId},data);
          // amenities.save()
          res.status(200).json({status: true, message: messages.SUCCESS, data: data});
        }
        catch (e) {
          logger.error(e);

    }

  },

  // Remove Amenities

  removeamenities: async (req, res) => {
    var body = req.body;
    try {
      var data = {
        amenities : body.amenities,
      }
      var amenities =  await amenitiesModel.findOneAndRemove({_id:body.amenitiesId});

      res.status(200).json({status: true, message: messages.SUCCESS, data: data});
    }
    catch (e) {
      logger.error(e);
      return res.status(500).send(e);
    }
  },

    // Add Activities

    addactivities: async (req, res) => {
      var body = req.body;
      console.log(body , "djkfhgjhfjghfjgjfd");
      try {
        var data = {
          activities : body.activities,
        }
        var activities =  new  activitiesModel(data);
        await activities.save();
        res.status(200).json({status: true, message: messages.SUCCESS, data: data});

      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }

    },

    // Update Activities

    updateactivities: async (req, res) => {
      var body = req.body;
      try {
        var data = {
          activities : body.activities,
        }
        var activities =  await activitiesModel.findOneAndUpdate({_id:body.activitiesId},data);
        res.status(200).json({status: true, message: messages.SUCCESS, data: data});
      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }
    },

    // Remove Activities

    removeactivities: async (req, res) => {
      var body = req.body;
      try {
        var data = {
          activities : body.activities,
        }
        var activities =  await activitiesModel.findOneAndRemove({_id:body.activitiesId});

        res.status(200).json({status: true, message: messages.SUCCESS, data: data});
      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }
    },

    // Add Property type

    addpropertytype: async (req, res) => {
      var body = req.body;
      try {
        var data = {
          property_type : body.property_type,
        }
        var propertytype =  new  propertyTypeModel(data);
        await propertytype.save();
        res.status(200).json({status: true, message: messages.SUCCESS, data: data});

      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }

    },

    // Update Property type

    updatepropertytype: async (req, res) => {
      var body = req.body;
      try {
        var data = {
          property_type : body.property_type,
        }
        var property_type =  await propertyTypeModel.findOneAndUpdate({_id:body.propertytypeId},data);
        res.status(200).json({status: true, message: messages.SUCCESS, data: data});
      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }
    },

    // Remove Property type

    removepropertytype: async (req, res) => {
      var body = req.body;
      try {
        var data = {
          property_type : body.property_type,
        }
        var property_type =  await propertyTypeModel.findOneAndRemove({_id:body.propertytypeId});
        res.status(200).json({status: true, message: messages.SUCCESS, data: data});
      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }
    },

    // Add Uniques Interested with regex

    addinterest: async (req, res) => {
      var body = req.body;
      console.log(body , "Abbe sale");

      try {

        var interest = await interestModel.findOne({interests: {"$regex": `${body.interests}`, "$options": "i"}});
        if(interest){
          return res.status(200).json({status: false, message: "This interest is Already present in the DB"});
        }

        else {
          var data = {
            interests : body.interests,
          }
          var interest =  new  interestModel(data);
          await interest.save();
          res.status(200).json({status: true, message: messages.SUCCESS, data: data});
        }

      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }

    },

    // Update Uniques Interested with regex

    updateinterest: async (req, res) => {
      var body = req.body;
      try {
        var interest = await interestModel.findOne({interests: {"$regex": `${body.interests}`, "$options": "i"}});
        if(interest){
          return res.status(200).json({status: false, message: "This interest is Already present in the DB"});
        }
        else {
          var data = {
            interests : body.interests,
          }
          var interest =  await interestModel.findOneAndUpdate({_id:body.interestId},data);
          res.status(200).json({status: true, message: messages.SUCCESS, data: data});
        }
      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }
    },

    // Remove Uniques Interested with regex

    removeinterest: async (req, res) => {
      var body = req.body;
      try {
        var data = {
          interests : body.interests,
        }
        var interest =  await interestModel.findByIdAndRemove({_id:body.interestId});
        res.status(200).json({status: true, message: messages.SUCCESS, data: data});
      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }
    },

    // Add Vehicles

    addvehicles: async (req, res) => {
      var body = req.body;
      try {
        var vehicle = await vehicleModel.findOne({ vehicle: {"$regex": body.vehicle,"$options":"i"} });

        if(vehicle){
          return res.status(200).json({status: false, message: "Vehicle already exists"});
        }
        else{
          var data = {
            vehicle : body.vehicle,
          }
          var vehicles =  new  vehicleModel(data);
          await vehicles.save();
          res.status(200).json({status: true, message: messages.SUCCESS, data: data});
        }


      } catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }

    },

    // Update Vehicles with regex

    updatevehicles: async (req, res) => {
      var body = req.body;
      try {
        var vehicle = await vehicleModel.findOne({ vehicle: {"$regex":`${body.vehicle}` ,"$options":"i"} });
        if(vehicle){
          return res.status(200).json({status: false, message: "Vehicle already exists"});
        }
        else{
          var data = {
            vehicle : body.vehicle,
          }
          var vehicles =  await vehicleModel.findOneAndUpdate({_id:body.vehicleId},data);
          res.status(200).json({status: true, message: messages.SUCCESS, data: data});
        }
      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }
    },

    // Remove Vehicles with regex

    removevehicles: async (req, res) => {
      var body = req.body;
      console.log(body ,"Hello I am the lion");
      try {
        var data = {
          vehicle : body.vehicle,
        }
        console.log(data + "data");
        var vehicles =  await vehicleModel.findOneAndRemove({_id:body.vehicleId});
        res.status(200).json({status: true, message: messages.SUCCESS, data: data});
      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }
    },

    // Add Amenities from the Admin

    addadminamenities: async (req, res) => {

      var body = req.body;

      try {
      var amenities = await amenitiesModel.findOne({ amenities: {"$regex": req.body.amenities,"$options":"i"} });

      if(amenities){
        return res.status(200).json({status: false, message: "Amenities already exists"});
      }
      else{
        var data = {
          amenities : body.amenities,
          travel_radius : body.travel_radius,
        }
        var adminamenities =  new  adminAmenitiesModel(data);
        await adminamenities.save();
        res.status(200).json({status: true, message: messages.SUCCESS, data: data});
     
    }

  } catch (e) {
    logger.error(e);
    return res.status(500).send(e);
  }
},

    // Update Amenities from the Admin
    
    updateadminamenities: async (req, res) => {

      var body = req.body;

      try {
      var amenities = await amenitiesModel.findOne({ amenities: {"$regex": req.body.amenities,"$options":"i"} });

      if(amenities){
        return res.status(200).json({status: false, message: "Amenities already exists"});
      }
      else{
        var data = {
          amenities : body.amenities,
          travel_radius : body.travel_radius,
        }
        var adminamenities =  await adminAmenitiesModel.findByIdAndUpdate({_id:body._id},data);
        res.status(200).json({status: true, message: message.SUCCESS, data: data});
     
    }

  } catch (e) {
    logger.error(e);
    return res.status(500).send(e);
  }
},

    // Remove Amenities from the Admin

    removeadminamenities: async (req, res) => {
      
      var body = req.body;

      try {
        var data = {
          amenities : body.amenities,
          travel_radius : body.travel_radius,
        }
        var adminamenities =  await adminAmenitiesModel.findByIdAndRemove({_id:body._id});
        res.status(200).json({status: true, message: message.SUCCESS, data: data});
      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }
    },


// Add Cancellation Policy

    addcancellationpolicy: async (req, res) => {
      var body = req.body;
      try {

        var data = {
          cancellation_policy : body.cancellation_policy,
        }
        var cancellation_policy = new cancellationPolicyModel(data);
        await cancellation_policy.save();
        res.status(200).json({status: true, message: message.SUCCESS, data: data});

      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }
    },

    // Add Rules

    addrules: async (req, res) => {
      var body = req.body;
      try {

        var data = {
          rules : body.rules,
        }
        var rules = new rulesModel(data);
        await rules.save();
        res.status(200).json({status: true, message: message.SUCCESS, data: data});

      }
      catch (e) {
        logger.error(e);
        return res.status(500).send(e);
      }
    },



    

  

}