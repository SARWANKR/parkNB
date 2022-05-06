const express = require('express');
const router = express.Router();
const service= require('./service')
const Joi = require('joi');
// const userModel = require("./models/user");
const message = require("../commonfunctions").customMessages();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const adminModel = require('./models/admin');

const storage = multer.diskStorage({
    destination: function (req, file ,cb) {
        cb(null, './public/banner')

    },
    filename: function (req, file, cb) {
        cb(null,"FILE-" + Date.now() + (file.originalname))
    }
})

var upload = multer({storage:storage});




router.post('/admin/add/createAdmin',service.createAdmin);
router.post('/admin/add/login',joiValidation,service.login);

router.post('/admin/add/amenities',isAuthenticated,joiValidation,service.addamenities)
router.post('/admin/add/updateamenities',isAuthenticated,joiValidation,service.updateamenities);
router.post('/admin/add/removeamenities',isAuthenticated,joiValidation,service.removeamenities);

router.post('/admin/add/activities',isAuthenticated,joiValidation,service.addactivities)
router.post('/admin/add/updateactivities',isAuthenticated,joiValidation,service.updateactivities);
router.post('/admin/add/removeactivities',isAuthenticated,joiValidation,service.removeactivities);

router.post('/admin/add/propertytype',isAuthenticated,joiValidation,service.addpropertytype)
router.post('/admin/add/updatepropertytype',isAuthenticated,joiValidation,service.updatepropertytype);
router.post('/admin/add/removepropertytype',isAuthenticated,joiValidation,service.removepropertytype);

router.post('/admin/add/addvehicles',isAuthenticated,joiValidation,service.addvehicles)
router.post('/admin/add/updatevehicles',isAuthenticated,joiValidation,service.updatevehicles);
router.post('/admin/add/removevehicles',isAuthenticated,joiValidation,service.removevehicles);

router.post('/admin/add/addinterest',isAuthenticated,joiValidation,service.addinterest)
router.post('/admin/add/updateinterest',isAuthenticated,joiValidation,service.updateinterest);
router.post('/admin/add/removeinterest',isAuthenticated,joiValidation,service.removeinterest);

router.post('/admin/add/addadminamenities',isAuthenticated,joiValidation,service.addadminamenities)
router.post('/admin/add/updateadminamenities',isAuthenticated,joiValidation,service.updatevehicles);
router.post('/admin/add/removeadminamenities',isAuthenticated,joiValidation,service.removevehicles);

router.post('/admin/add/addcancellationpolicy',isAuthenticated,joiValidation,service.addcancellationpolicy)
router.post('/admin/add/addrules',isAuthenticated,joiValidation,service.addrules)

router.post('/admin/add/addbanner',isAuthenticated,upload.array('file'),service.addbanner);


// Joi Validation

function joiValidation(req,res,next) {
    console.log(req.body, "hey i am body");
    const amenitiesSchema = Joi.object({
        amenities : Joi.string().required(),
       
    });

    const updateamenitiesSchema = Joi.object({
        amenities : Joi.string().required(),
        amenitiesId : Joi.string().required(),
    });

    const removeamenitiesSchema = Joi.object({
        amenitiesId : Joi.string().required(),
    });

    const loginSchema = Joi.object({
        email : Joi.string().required(),
        password : Joi.string().required(),
    });


    const activitiesSchema = Joi.object({
        activities : Joi.string().required(),

    });

    const updateactivitiesSchema = Joi.object({
        activities : Joi.string().required(),
        activitiesId : Joi.string().required(),
    });

    const removeactivitiesSchema = Joi.object({
        activitiesId : Joi.string().required(),
    });

    const propertytypeSchema = Joi.object({
        property_type : Joi.string().required(),
    });

    const updatepropertytypeSchema = Joi.object({
        property_type : Joi.string().required(),
        propertytypeId : Joi.string().required(),
    });

    const removepropertytypeSchema = Joi.object({
        propertytypeId : Joi.string().required(),
    });


    const vehiclesSchema = Joi.object({
        vehicle : Joi.string().required(),
    });

    const updatevehiclesSchema = Joi.object({
        vehicle : Joi.string().required(),
        vehicleId : Joi.string().required(),
    });

    const removevehiclesSchema = Joi.object({
        vehicleId : Joi.string().required(),
    });

    const interestSchema = Joi.object({
        interests : Joi.string().required(),
    });

    const updateinterestSchema = Joi.object({
        interests : Joi.string().required(),
        interestId : Joi.string().required(),
    });

    const removeinterestSchema = Joi.object({
        interestId : Joi.string().required(),
    });


    const adminamenitiesSchema = Joi.object({
        amenities : Joi.string().required(),
    });

    const updateadminamenitiesSchema = Joi.object({
        adminamenities : Joi.string().required(),
        adminamenitiesId : Joi.string().required(),
    });

    const removeadminamenitiesSchema = Joi.object({
        adminamenitiesId : Joi.string().required(),
    });

    const cancellationpolicySchema = Joi.object({
        cancellationpolicy : Joi.string().required(),
    });

    const rulesSchema = Joi.object({
        rules : Joi.string().required(),
    });


const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

if(req.path =='/admin/add/login') var { error, value } = loginSchema.validate(req.body,options);

if(req.path =='/admin/add/amenities') var { error, value } = amenitiesSchema.validate(req.body,options);
if(req.path == '/admin/add/updateamenities') var { error, value } = updateamenitiesSchema.validate(req.body,options);
if(req.path == '/admin/add/removeamenities') var { error, value } = removeamenitiesSchema.validate(req.body,options);

if(req.path =='/admin/add/activities') var { error, value } = activitiesSchema.validate(req.body,options);
if(req.path == '/admin/add/updateactivities') var { error, value } = updateactivitiesSchema.validate(req.body,options);
if(req.path == '/admin/add/removeactivities') var { error, value } = removeactivitiesSchema.validate(req.body,options);

if(req.path =='/admin/add/propertytype') var { error, value } = propertytypeSchema.validate(req.body,options);
if(req.path == '/admin/add/updatepropertytype') var { error, value } = updatepropertytypeSchema.validate(req.body,options);
if(req.path == '/admin/add/removepropertytype') var { error, value } = removepropertytypeSchema.validate(req.body,options);

if(req.path =='/admin/add/addvehicles') var { error, value } = vehiclesSchema.validate(req.body,options);
if(req.path == '/admin/add/updatevehicles') var { error, value } = updatevehiclesSchema.validate(req.body,options);
if(req.path == '/admin/add/removevehicles') var { error, value } = removevehiclesSchema.validate(req.body,options);

if(req.path =='/admin/add/addinterest') var { error, value } = interestSchema.validate(req.body,options);
if(req.path == '/admin/add/updateinterest') var { error, value } = updateinterestSchema.validate(req.body,options);
if(req.path == '/admin/add/removeinterest') var { error, value } = removeinterestSchema.validate(req.body,options);

if(req.path =='/admin/add/addcancellationpolicy') var { error, value } = cancellationpolicySchema.validate(req.body,options);
if(req.path =='/admin/add/addrules') var { error, value } = rulesSchema.validate(req.body,options);

if(req.path =='/admin/add/addadminamenities') var { error, value } = adminamenitiesSchema.validate(req.body,options);
if(req.path == '/admin/add/updateadminamenities') var { error, value } = updateadminamenitiesSchema.validate(req.body,options);
if(req.path == '/admin/add/removeadminamenities') var { error, value } = removeadminamenitiesSchema.validate(req.body,options);

//error handling
if(error){
    // returning the error if there is anything
    return res.json({status:false,code:201,message:`${error.details.map(x=>x.message.replace(/"/g, ''))[0]}`})
}
else{
    req.body=value;
    next();
}
}

// Authentication middleware

async function isAuthenticated(req,res,next) {
 let givenToken=req.headers['x-token']||req.query['token'];
 console.log(givenToken);
 let existingToken= await adminModel.findOne({accessToken:givenToken})
 console.log(existingToken,"xxxxxxx",givenToken);
 

 if(!existingToken) {
     return res.send({status:false,code:203,message:message.SESSION_ERROR});
 }else{
     if(givenToken==existingToken.accessToken){
         jwt.verify(givenToken,process.env.JWT_SECRET,(err,result)=>{
             if(err) return res.send({status:false,code:203,message:message.SESSION_ERROR});
             else 
             next()
         })
       } else {
         return res.send({status:false,code:203,message:message.SESSION_ERROR})
      }
 }

 
   
}


/**
 * @swagger
 * /admin/add/login:
 *   post:
 *     summary: Admin Login
 *     description: email, and Password Required
 *     tags: [admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *             
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /admin/add/amenities:
 *   post:
 *     summary: Add Amenities
 *     description: Access Token, Amenities Required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              amenities:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /admin/add/updateamenities:
 *   post:
 *     summary: Update Amenities
 *     description: Access Token, Amenities Required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              amenities:
 *                type : string
 *              amenitiesId:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /admin/add/removeamenities:
 *   post:
 *     summary: Remove Amenities
 *     description: Access Token, Amenities Id required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              amenitiesId:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /admin/add/activities:
 *   post:
 *     summary: Add Activities
 *     description: Access Token, Amenities Required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              activities:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Activities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /admin/add/updateactivities:
 *   post:
 *     summary: Add Activities
 *     description: Access Token, Activities Required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              activities:
 *                type : string
 *              activitiesId:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /admin/add/removeactivities:
 *   post:
 *     summary: Add Activities
 *     description: Access Token, Amenities Required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              amenitiesId:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /admin/add/propertytype:
 *   post:
 *     summary: Add Property Type
 *     description: Access Token, Property Type Required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              property_type:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /admin/add/updatepropertytype:
 *   post:
 *     summary: Update Property Type
 *     description: Access Token, Amenities Required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              property_type:
 *                type : string
 *              propertytypeId:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /admin/add/removepropertytype:
 *   post:
 *     summary: Remove Property Type
 *     description: Access Token, Remove Property Type Required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              propertytypeId:
 *                type : string
 *     responses:
 *       200:
 *         description: Remove Property Type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /admin/add/addvehicles:
 *   post:
 *     summary: Add Vehicles
 *     description: Access Token, Vehicles Required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              vehicles:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /admin/add/updatevehicles:
 *   post:
 *     summary: update Vehicles
 *     description: Access Token, Amenities Id required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              vehicle:
 *                type : string
 *              vehicleId:
 *                type : string
 *              
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /admin/add/removevehicles:
 *   post:
 *     summary: Remove Vehicles
 *     description: Access Token, Remove Vehicles Id required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              vehicleId:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /admin/add/addinterest:
 *   post:
 *     summary: Add Interest
 *     description: Access Token, Interest Required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              interests:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /admin/add/updateinterest:
 *   post:
 *     summary: update Vehicles
 *     description: Access Token, Amenities Id required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              interests:
 *                type : string
 *              interestId:
 *                type : string
 *              
 *     responses:
 *       200:
 *         description: Add Interest
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /admin/add/removeinterest:
 *   post:
 *     summary: Remove Vehicles
 *     description: Access Token, Remove Interest Id required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              interestId:
 *                type : string
 *     responses:
 *       200:
 *         description: Remove Interest
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /admin/add/addadminamenities:
 *   post:
 *     summary: Add Interest
 *     description: Access Token, Interest Required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              amenities:
 *                type : string
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /admin/add/updateadminamenities:
 *   post:
 *     summary: update Vehicles
 *     description: Access Token, Amenities Id required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              amenities:
 *                type : string
 *              amenitiesId:
 *                type : string
 *              
 *     responses:
 *       200:
 *         description: Add Amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /admin/add/removeadminamenities:
 *   post:
 *     summary: Remove Admin Amenities
 *     description: Access Token, Remove Admin Amenities Id required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              interestId:
 *                type : string
 *     responses:
 *       200:
 *         description: Remove Interest
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


module.exports=router;