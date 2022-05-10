const express = require('express');
const router = express.Router();
const service= require('./service')
const Joi = require('joi');
const userModel = require("./models/user");
const message = require("../commonfunctions").customMessages();
const jwt = require('jsonwebtoken');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null,"FILE-" + Date.now() + (file.originalname))
    }
})

var upload = multer({ storage: storage});

const multerStorage =multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/profilePic')
    },
    filename: function (req, file, cb) {
        cb(null,"FILE-" + Date.now() + (file.originalname))
    }
})

var uploadProfilePic = multer({ storage: multerStorage});


const govtId = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/govtId')
    },
    filename: function (req, file, cb) {
        cb(null,"FILE-" + Date.now() + (file.originalname))
    }
})

var governmentId = multer({ storage: govtId});

const event = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/event')
    }
})

var uploadEvent = multer({ storage: event});



// Routes
  /***************************AUTHENTICATION MODULES*************************************** */
// router.post('/user/generateOtp',joiValidation,service.generateOtp);
router.post('/user/verifyOtp',joiValidation,service.verifyOtp);
router.post('/user/register',joiValidation,service.register);
router.post('/user/resendOtp',joiValidation,service.resendOtp);
router.post('/user/sendlink',joiValidation,service.sendLink);
router.post('/user/resetpassword',joiValidation,service.resetpassword);
router.get('/user/emailVerified/:id',service.emailVerified);
router.post('/user/login',joiValidation,service.login);
router.post('/user/logout',isAuthenticated,service.logout);
router.post('/user/forgotPassword',joiValidation,service.forgot);
router.post('/user/changePassword',isAuthenticated,service.changePassword);
router.post('/user/uploadGovtId',governmentId.array('files'),isAuthenticated,joiValidation,service.uploadGovtid);
router.post('/user/updateGovtId',isAuthenticated,governmentId.array('file'),service.updateGovtId);
router.post('/user/updateProfile',isAuthenticated,joiValidation,uploadProfilePic.single('file'),service.updateProfile);
router.get('/user/getProfile/:id',isAuthenticated,joiValidation,service.getProfile);
router.post('/user/interstedIn',isAuthenticated,service.interstedIn);
router.post('/user/addvehicle',isAuthenticated,service.addvehicle);
router.post('/user/amenities',isAuthenticated,service.amenities);
router.get('/user/getdata',isAuthenticated,joiValidation,service.getdata);
router.post('/user/superhost',isAuthenticated,service.superhost);


/**********************************PROPERTY MODULES****************************************** */

router.post('/user/add/addproperty1',isAuthenticated,joiValidation,service.addproperty1);
router.post('/user/add/addproperty2',isAuthenticated,joiValidation,service.addproperty2);
router.post('/user/add/addproperty3',isAuthenticated,upload.array('file'),service.addproperty3);
router.post('/user/add/selectDates',isAuthenticated,service.selectDates);
router.get('/user/fetchPropertyList', isAuthenticated,service.fetchPropertyDetails);
router.get('/user/propertyDetails',isAuthenticated,service.propertyDetails);
router.post('/user/add/favoriteProperty',isAuthenticated,service.favoriteProperty);
router.get('/user/favoritePropertyList',isAuthenticated,service.favoritePropertyList);


/***********************************REVIEW MODULES******************************************** */

router.post('/user/add/propertyReview',isAuthenticated,joiValidation,service.propertyReview);
router.post('/user/add/addHostReview',isAuthenticated,joiValidation,service.addHostReview);
router.post('/user/add/sendFeedBack',isAuthenticated,service.sendFeedBack);
router.get('/user/allPropertyReviews',isAuthenticated,service.allPropertyReviews);

/***********************************ADD EVENT************************************************* */

router.post('/user/add/addEvent',isAuthenticated,uploadEvent.array('file'),service.addEvent);
router.post('/user/add/updateEvent',isAuthenticated,joiValidation, service.updateEvent);
router.post('/user/add/coHostProperty',isAuthenticated,joiValidation,service.coHostProperty);



/*************************************REQUEST MODEL******************************************* */

router.post('/user/sendRequest', isAuthenticated,joiValidation,service.sendRequest);
router.post('/user/acceptDecline', isAuthenticated,joiValidation,service.acceptOrDecline);

/*************************************REPORT USER********************************************* */

router.post('/user/reportUser', isAuthenticated,joiValidation,service.reportTheUser);

/*************************************BOOKING THE PROPERTY************************************ */

router.post('/user/bookProperty', isAuthenticated,joiValidation,service.bookProperty);
router.post('/user/cancelBooking', isAuthenticated,service.cancelBooking);
router.post('/user/filterProperty', isAuthenticated,service.filterProperty);

/*************************************HOME SCREEN******************************************** */

router.get('/user/homeScreen', isAuthenticated,service.getHomeScreenData);
router.get('/user/myListing', isAuthenticated,service.myListing);
router.get('/user/getTripsDetails', isAuthenticated,service.getTripsDetails);

// Joi Validation

function joiValidation(req,res,next) {
    // console.log(req.body, "hey i am body");
    const otpSchema = Joi.object({
        "contact": Joi.string().required(),
        "countryCode": Joi.string().required(),
        "email" : Joi.string().email({ tlds: {allow: false} }).optional().allow(''),
        "type" : Joi.string().required(),
       
    });

    const bookPropertySchema = Joi.object({
        "propertyId": Joi.string().required(),
        "userId": Joi.string().required(),
        "bookingId" : Joi.string().required(),
    });

    const sendLinkSchema = Joi.object({

        "email" : Joi.string().email({ tlds: {allow: false} }).required()

    });

    const resendOtpSchema = Joi.object({
        "contact": Joi.string().allow().optional(),
        "countryCode": Joi.string().allow().optional(),
        "email" : Joi.string().email({ tlds: {allow: false} }).optional().allow(''),
        "type" : Joi.string().required(),
    });



    const verifyOtpSchema = Joi.object({
        "otp" : Joi.string().required(),
        "contact" : Joi.string().allow().optional(),
        "email" : Joi.string().email({ tlds: {allow: false} }).allow().optional(),
        "countryCode" : Joi.string().allow().optional()
    });
    const userSchema=Joi.object({
        "full_name": Joi.string().required().min(3).max(30),
        "email": Joi.string().email({ tlds: {allow: false} }).required(),
        "profile_pic": Joi.string().allow().optional(),
        "about" : Joi.string().allow().optional(),
        "password": Joi.string().min(6).max(15).required(),
        "contact": Joi.string().required(),
        "countryCode": Joi.string().required(),
        "role": Joi.string().required(),
        "login_type": Joi.string().required(),
        "device_Token": Joi.string().required(),
        "device_type": Joi.string().required(),
        "device_modal": Joi.string().required(),
        "app_version": Joi.string().required(),
        "longitude": Joi.string().required(),
        "latitude": Joi.string().required(),
        "address_name": Joi.string().optional().allow('')
    });
    const updateProfileSchema=Joi.object({
        'full_name': Joi.string().min(3).max(30).optional().allow(""),
        'email': Joi.string().email({ tlds: {allow: false} }).optional().allow(""),
        'contact': Joi.string().optional().allow(""),
        'countryCode': Joi.string().optional().allow(""),
        'about': Joi.string().optional().allow(""),
        'profile_pic': Joi.string().optional().allow(""),
        'userId': Joi.string().required(),
        "address_name": Joi.string().optional().allow(""),
        'longitude':Joi.string().optional().allow(""),
        'latitude':Joi.string().optional().allow(""),
        'designation' : Joi.string().optional().allow(""),
        'language' : Joi.array().optional().allow(""),
    })

    const loginSchema = Joi.object({
        "email" : Joi.string().email({ tlds: {allow: false} }).allow().optional().allow(''),
        "password": Joi.string().min(6).max(15).optional().allow('').optional(),
        "contact" : Joi.string().allow().optional().allow('').optional(),
        "countryCode" : Joi.string().allow().optional().allow('').optional(),
        // device_Token : Joi.string().allow().optional(),
    
    })
    const forgotSchema = Joi.object({
        "email" : Joi.string().email({ tlds: {allow: false} }).required()
    })

    const changePasswordSchema = Joi.object({
        "old_password" : Joi.string().min(6).max(15).required(),
        "new_password" : Joi.string().min(6).max(15).required()
    });


    const resetpasswordSchema = Joi.object({
        "email" : Joi.string().email({ tlds: {allow: false} }).required(),
        "password" : Joi.string().min(6).max(15).required()
    });

    const getProfileSchema = Joi.object({
        "userId" : Joi.string().required()
    });


    const propetyDetailsSchema = Joi.object({
        "propertyId" : Joi.string().required()
    });

    const propertyReviewSchema = Joi.object({
        "propertyId" : Joi.string().required(),
        "userId" : Joi.string().required(),
        "review" : Joi.string().optional().allow(''),
        "rating" : Joi.number().optional().allow(''),
    });

    const hostReviewSchema = Joi.object({
        "hostId" : Joi.string().required(),
        "userId" : Joi.string().required(),
        "review" : Joi.string().optional().allow(''),
        "rating" : Joi.number().optional().allow(''),
    });

    const govSchema = Joi.object({
        "userId" : Joi.string().required(),
        "type" : Joi.string().required(),
    })

    const logoutSchema = Joi.object({
        "userId" : Joi.string().required(),
    })


    /***********************************PROPERTY JOI VALIDATION******************************* */

    const property1Schema = Joi.object({
        "userId" : Joi.string().required(),
        "property_type" : Joi.array().required(),
        "add_title" : Joi.string().required(),
        "add_description" : Joi.string().required(),
        "amenities" : Joi.array().required(),
        "activities" : Joi.array().required(),
    });

    // console.log(req.body, "hey i am body");

    const property2Schema = Joi.object({

        "propertyId" : Joi.string().required(),
        "adults" : Joi.number().required(),
        "bedrooms" : Joi.number().required(),
        "washrooms" : Joi.number().required(),
        "not_to_bring" : Joi.array().required(),
        "rules" : Joi.string().required(),
        "longitude" : Joi.string().required(),
        "latitude" : Joi.string().required(),
        "co_host" : Joi.boolean().required(),

    });

    const property3Schema = Joi.object({

        "propertyId" : Joi.string().required(),
        "file" : Joi.array().required(),
        "price" : Joi.string().required(),


    });

    const selectDatesSchema = Joi.object({
        "propertyId" : Joi.string().required(),
        "start_date" : Joi.string().required(),
        "end_date" : Joi.string().required(),

    });

    // const fetchPropertyDetailsSchema = Joi.object({
    //     "propertyId" : Joi.string().required()
    // });

    const sendFeedBackSchema = Joi.object({
        "title" : Joi.string().required(),
        "description" : Joi.string().required(),
    });

    const favoritePropertySchema = Joi.object({
        "userId" : Joi.string().required(),
        "propertyId" : Joi.string().required(),
        "property_type" : Joi.string().required(),
    });

    const favoritePropertyListSchema = Joi.object({
        "userId" : Joi.string().required(),
        "propertyId" : Joi.string().required()
    });

    const addEventSchema = Joi.object({
        "userId" : Joi.string().required(),
        "eventId" : Joi.string().required(),
        "event_name" : Joi.string().required(),
        "event_description" : Joi.string().required(),
        "event_Picture" : Joi.array().required(),
        "longitude" : Joi.string().required(),
        "latitude" : Joi.string().required(),
        "event_date" : Joi.string().required(),
        "event_time" : Joi.string().required(),
        "event_price" : Joi.string().required(),
        "event_Adress" : Joi.string().required(),

    });
    
    const updateEvent = Joi.object({
        "userId" : Joi.string().optional().allow(''),
        "eventId" : Joi.string().optional().allow(''),
        "event_name" : Joi.string().optional().allow(''),
        "event_description" : Joi.string().optional().allow(''),
        
    })

    const CohostSchema = Joi.object({
        "userId" : Joi.string().required(),
        "propertyId" : Joi.string().required(),

    })

    // console.log(req.body, "PPPPPPPPPPPPPPPPPPPPPPPPP");

    const sendRequestSchema = Joi.object({
        "userId" : Joi.string().required(),
        "propertyId" : Joi.string().required(),
        "start_date" : Joi.string().required(),
        "end_date" : Joi.string().required(),
        "status" : Joi.string().required(),
        "adults" : Joi.number().required(),
        "childrens" : Joi.number().required(),
        "infants" : Joi.number().required(),
        "no_of_room_required" : Joi.number().required(),

    })

    const acceptDeclineRequestSchema = Joi.object({
        "requestId" : Joi.string().required(),
        "status" : Joi.string().required(),
    })
    const reportUserSchema=Joi.object({
        "userId":Joi.string().required(),
        "reportinId":Joi.string().required(),
        "reportedText":Joi.string().optional().allow('')
    })

    const cancelBookingSchema = Joi.object({
        "requestId" : Joi.string().required()
        // "status" : Joi.string().required(),
    })


    // schema options
   const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};


// paths
if(req.path =='/user/generateOtp') var { error, value } = otpSchema.validate(req.body,options);
if(req.path=='/user/register') var {error,value}= userSchema.validate(req.body,options);
// if(req.path=='/user/resendOtp') var {error,value}= otpSchema.validate(req.body,options);
if(req.path=='/user/login') var {error,value}= loginSchema.validate(req.body,options);
if(req.path=='/user/updateProfile') var { error ,value }= updateProfileSchema.validate(req.body,options)
if(req.path=='/user/forgotPassword') var { error ,value }= forgotSchema.validate(req.body,options)
if(req.path=='/user/changePassword') var { error ,value }= changePasswordSchema.validate(req.body,options)
if(req.path=='/user/sendlink') var { error ,value }= sendLinkSchema.validate(req.body,options)
if(req.path=='/user/resendOtp') var { error ,value }= resendOtpSchema.validate(req.body,options)
if(req.path=='/user/verifyOtp') var { error ,value }= verifyOtpSchema.validate(req.body,options)
if(req.path=='/user/resetpassword') var { error ,value }= resetpasswordSchema.validate(req.body,options)
if(req.path=='/user/logout') var { error , value} = logoutSchema.validate(req.body,options)
if(req.path== '/user/add/addproperty1') var { error , value} = property1Schema.validate(req.body,options)
if(req.path== '/user/add/addproperty2') var { error , value} = property2Schema.validate(req.body,options)
if(req.path=='/user/add/addproperty3') var { error , value} = property3Schema.validate(req.body,options)
if(req.path=='/user/add/selectDates') var { error , value} = selectDatesSchema.validate(req.body,options)
if(req.path =='/user/add/propertyReview') var { error , value} = propertyReviewSchema.validate(req.body,options)
if(req.path =='/user/add/addHostReview') var { error , value} = hostReviewSchema.validate(req.body,options)
if(req.path =='/user/add/updateEvent') var { error , value} = updateEvent.validate(req.body,options)
if(req.path =='/user/sendRequest') var { error , value} = sendRequestSchema.validate(req.body,options)
if(req.path =='/user/acceptDecline') var { error , value} = acceptDeclineRequestSchema.validate(req.body,options)
// if(req.path=='/user/fetchPropertyList') var { error , value} = fetchPropertyListSchema.validate(req.body,options)
if(req.path=='/user/reportUser') var { error , value} = reportUserSchema.validate(req.body,options)
if(req.path=='/user/add/coHostProperty') var { error , value} = CohostSchema.validate(req.body,options)
if(req.path=='/user/add/sendFeedBack') var { error , value} = sendFeedBackSchema.validate(req.body,options)
if(req.path=='/user/uploadGovtId') var { error , value} = govSchema.validate(req.body,options)
if(req.path=='/user/bookProperty') var { error , value} = bookPropertySchema.validate(req.body,options)
if(req.path=='/user/cancelBooking') var { error , value} = cancelBookingSchema.validate(req.body,options)

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
//  console.log(givenToken);
 let existingToken= await userModel.findOne({accessToken:givenToken})
//  console.log(existingToken,"xxxxxxx",givenToken);
 

 if(!existingToken) {
     return res.send({status:false,code:203,message:message.SESSION_ERROR});
 }else{
     if(givenToken==existingToken.accessToken){
         jwt.verify(givenToken,process.env.JWT_SECRET,(err,result)=>{
             if(err) return res.send({status:false,code:203,message:message.SESSION_ERROR});
             else 
             req.body.userId=existingToken._id.toString()
            //  console.log(req.body.userId,"userId");
             next()
         })
       } else {
         return res.send({status:false,code:203,message:message.SESSION_ERROR})
      }
 }

 
   
}


/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: user registration
 *     description: email,password is required
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              full_name:
 *                type: string
 *              contact:
 *                type: string
 *              countryCode:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              longitude:
 *                type: string
 *              latitude:
 *                type: string
 *              role:
 *                type: string
 *              address_name:
 *                type: string
 *              login_type:
 *                type: string
 *              device_Token:
 *                type: string
 *              device_type:
 *                type: string
 *              device_modal:
 *                type: string
 *              app_version:
 *                type: string
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
 * /user/resendOtp:
 *   post:
 *     summary: resend otp
 *     description: Contact Number and Country Code is required
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              contact:    
 *                iser_: string
 *              countryCode:
 *                type: string
 *              email:
 *                type: string
 *              type:
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
 * /user/verifyOtp:
 *   post:
 *     summary: generate otp
 *     description: email, contact and countryCode is required
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string
 *              otp:
 *                type: string
 *              contact:    
 *                type: string
 *              countryCode:
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
 * /user/sendlink:
 *   post:
 *     summary: generate otp
 *     description: email, contact and countryCode is required
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
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
 * /user/login:
 *   post:
 *     summary: user login
 *     description: email,password, contact and CountryCode Required
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              contact:
 *                type: string
 *              countryCode:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
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
 * /user/changePassword:
 *   post:
 *     summary: change password
 *     description: Access Token, Old Password, New Password Needed
 *     tags: [users]
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
 *              old_password :
 *                type : string
 *              new_password :
 *                type : string
 *     responses:
 *       200:
 *         description: update password 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/uploadGovtId:
 *   post:
 *     summary: change password
 *     description: Access Token, Old Password, New Password Needed
 *     tags: [users]
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
 *              govternmentId :
 *                type : string
 *              type :
 *                type : string
 *     responses:
 *       200:
 *         description: update password 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */



/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout
 *     description: X - Token
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: get profile successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/resetpassword:
 *   post:
 *     summary: send reset password link
 *     description: E-mail ID is required
 *     tags: [users]
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
 * /user/govtId:
 *   post:
 *     summary: Upload Govt Id
 *     description: Government Id is required
 *     tags: [users]
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
 *              file :
 *                type : string
 *     responses:
 *       200:
 *         description: update password 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/updateProfile:
 *   post:
 *     summary: Update Profile
 *     description: X - Token, Full Name , email , contact , countryCode needed
 *     tags: [users]
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
 *              full_name:
 *                type: string
 *              about:
 *                type: string
 *              profile_file:
 *                type: string
 *              email:
 *                type: string
 *              address_name:
 *                type: string
 *              contact:
 *                type: string
 *              countryCode:
 *                type: string
 *              longitude:
 *                type: string
 *              latitude:
 *                type: string
 *              designation:
 *                type: string
 *              identification:
 *                type: boolean
 *              superhost: 
 *                type: boolean
 *              languages:
 *                type: array
 *                items:
 *                  type: string
 *     responses:
 *       200:
 *         description: get profile successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /user/getProfile:
 *   get:
 *     summary: /user
 *     description: access token required
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        description: required
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *      - in: query
 *        description: required
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: get profile successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */



/**
 * @swagger
 * /user/forgotPassword:
 *   post:
 *     summary: Forgot Password
 *     description: Email Required
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string
 *     responses:
 *       200:
 *         description: update password 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/add/addproperty1:
 *   post:
 *     summary: Add property
 *     description: Property addition
 *     tags: [users]
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
 *              userId :
 *                type : string
 *              property_type :
 *                type : string
 *              add_title : 
 *                type : string
 *              add_description :
 *               type : string
 *              amenities:
 *                type: array
 *                items:
 *                  type: string
 *              activities:
 *                type: array
 *                items:
 *                  type: string
 *     responses:
 *       200:
 *         description: Add property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/add/addproperty2:
 *   post:
 *     summary: Add property
 *     description: Update Property Details
 *     tags: [users]
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
 *              rules :
 *                type : string
 *              longitude :
 *                type : string
 *              latitude : 
 *                type : string
 *              adults :
 *               type : number
 *              bedrooms :
 *               type : number
 *              washrooms :
 *               type : number
 *              co_host :
 *                type : boolean
 *              not_to_bring:
 *                type: array
 *                items:
 *                  type: string
 *     responses:
 *       200:
 *         description: Add property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/add/addproperty3:
 *   post:
 *     summary: Update Property
 *     description: Update Docs
 *     tags: [users]
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
 *              file :
 *                type : string
 *              price :
 *                type : number
 *     responses:
 *       200:
 *         description: update password 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/add/selectDates:
 *   post:
 *     summary: Update Property
 *     description: Update Docs
 *     tags: [users]
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
 *              start_date :
 *                type : string
 *              end_date :
 *                type : string
 *     responses:
 *       200:
 *         description: update password 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/add/favoriteProperty:
 *   post:
 *     summary: Add Favorite Property
 *     description: Add Favorite Property
 *     tags: [users]
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
 *              userId :
 *                type : string
 *              propertyId :
 *                type : string
 *     responses:
 *       200:
 *         description: update password 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/add/favoritepropertyList:
 *   get:
 *     summary: /user
 *     description: access token required
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        description: required
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *      - in: query
 *        description: required
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: get profile successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/add/PropertyReview:
 *   post:
 *     summary: Update Property
 *     description: Update Docs
 *     tags: [users]
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
 *              userId :
 *                type : string
 *              propertyId :
 *                type : string
 *              review :
 *                type : string
 *              rating :
 *                type : number
 *     responses:
 *       200:
 *         description: update password 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/add/addHostReview:
 *   post:
 *     summary: Update Property
 *     description: Update Docs
 *     tags: [users]
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
 *              hostId :
 *                type : string
 *              userId :
 *                type : string
 *              review :
 *                type : string
 *              rating :
 *                type : number
 *     responses:
 *       200:
 *         description: update password 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/add/sendfeedBack:
 *   post:
 *     summary: Update Property
 *     description: Update Docs
 *     tags: [users]
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
 *              title :
 *                type : string
 *              description :
 *                type : string
 *     responses:
 *       200:
 *         description: update password 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/allPropertyReviews:
 *   get:
 *     summary: Update Property
 *     description: Update Docs
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: update password 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */






/**
 * @swagger
 * /user/propertyDetails:
 *   get:
 *     summary: property details
 *     description: userId  required
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        description: required
 *        name: x-token
 *        schema:
 *          type: string
 *      - in: query
 *        description: required
 *        name: propertyId
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: get profile successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/fetchPropertyList:
 *   get:
 *     summary: List of property
 *     description: userId  required
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        description: required
 *        name: x-token
 *        schema:
 *          type: string
 *      - in: query
 *        description: required
 *        name: propertyId
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: get profile successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/add/addEvent:
 *   post:
 *     summary: Add property
 *     description: Property addition
 *     tags: [users]
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
 *              userId :
 *                type : string
 *              eventId :
 *                type : string
 *              event_name : 
 *                type : string
 *              event_description :
 *               type : string
 *              longitude : 
 *               type : string
 *              latitude :
 *               type : string
 *              event_date : 
 *               type : string
 *              event_time :
 *               type : string
 *              event_Adress : 
 *               type : string
 *              event_price :
 *               type : string
 * 
 *     responses:
 *       200:
 *         description: Add property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /user/add/updateEvent:
 *   post:
 *     summary: Update Event
 *     description: X - Token, Event Name & Event Description are required
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *      - in: header
 *        name: id 
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
 *              event_name:
 *                type: string
 *              event_description:
 *                type: string
 *     responses:
 *       200:
 *         description: get profile successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /user/add/coHostProperty:
 *   post:
 *     summary: Update Event
 *     description: X - Token, Full Name , email , contact , countryCode needed
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *      - in: header
 *        name: id
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
 *              userId:
 *                type: string
 *              propertyId:
 *                type: string
 *     responses:
 *       200:
 *         description: get profile successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/reportUser:
 *   post:
 *     summary: Report the user
 *     description: userId and token required
 *     tags: [users]
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
 *              userId:
 *                type: string
 *              reportinId:
 *                type: string
 *              reportedText:
 *                type: string
 *     responses:
 *       200:
 *         description: logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /user/sendRequest:
 *   post:
 *     summary: send Request
 *     description: Property Id and Dates are required
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        description: required
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
 *              propertyId:
 *                type: string
 *              start_date:
 *                type: string
 *              end_date:
 *                type: string
 *              status:
 *                type: string
 *              adults : 
 *                type : string
 *              childrens :
 *                type : string
 *              infants :
 *                type : string
 *              no_of_room_required :
 *                type : string
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
 * /user/acceptDecline:
 *   post:
 *     summary: Accept or Decline Request
 *     description: Property Id and Dates are required
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        description: required
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
 *              requestId:
 *                type: string
 *              status:
 *                type: string
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
 * /user/bookProperty:
 *   post:
 *     summary: Book Property
 *     description: Access Token, userID and propertyID are required
 *     tags: [users]
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
 *              userId: 
 *                type : string
 *              propertyId: 
 *                type : string
 *              bookingId:
 *                type : string
 *     responses:
 *       200:
 *         description: Book Property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/cancelBooking:
 *   post:
 *     summary: Cancel Booking
 *     description: Access Token, Requested Id and Status Required
 *     tags: [users]
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
 *              bookingId:
 *                type : string
 *              status:
 *                type : string 
 *     responses:
 *       200:
 *         description: Book Property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/interstedIn:
 *   post:
 *     summary: Interest 
 *     description: Interest Required (Optional)
 *     tags: [users]
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
 *                type: array
 *                items:
 *                  type: string
 *     responses:
 *       200:
 *         description: Intersted in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /user/addvehicle:
 *   post:
 *     summary: Add Vehicle
 *     description: Vehicle Required (Optional)
 *     tags: [users]
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
 *                type: array
 *                items:
 *                  type: string
 *     responses:
 *       200:
 *         description: Add Vehicle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/amenities:
 *   post:
 *     summary: Add Amenities
 *     description: Amenities Required (Optional)
 *     tags: [users]
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
 *                type: array
 *                items:
 *                  type: string
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
 * /user/filterProperty:
 *   post:
 *     summary: Cancel Booking
 *     description: Access Token, Requested Id and Status Required
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: Book Property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/getdata:
 *   get:
 *     summary: Get Data
 *     description: status required
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        description: required
 *        name: x-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: status
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: get data success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

module.exports=router;