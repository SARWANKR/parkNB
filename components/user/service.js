const userModel = require("./models/user");
const otpModel = require("./models/otpModel");
const propertyModel = require("./models/property");
const logger = require("../../config/logger");
const PropertyReviewModel = require("./models/propertyreview");
const HostReviewModel = require("./models/hostReview");
const eventModel = require("./models/event");
const coHostModel = require("./models/co_host");
const feedBackModel = require("./models/feedback");
const govtIdModel = require("./models/govtId");
const favoriteModel = require("./models/favorite");
const bookingModel = require("./models/booking");
const reportModel = require('./models/report');
const eventBookingModel = require("./models/eventBooking");
const confirmedBookingModel = require("./models/confirmedBooking");
const commonfunction = require("../commonfunctions");
const moment = require("moment");
const message = require("../commonfunctions").customMessages();
const lib = require("../../index");
const { mongoose } = require("../../index");
const env = require("../../env");
const appCred = require("../../config/appCredentials")[env.instance];
const path = require("path");
const parknb = require("../../index");
const amenitiesModel= require('../admin/models/amenities');
const interestModel= require('../admin/models/interesttedIn');
const vehicleModel= require('../admin/models/typeOfVehicle');


module.exports = {
  // Generate otp for user

  generateOtp: async (req, res) => {
    var body = req.body;
    console.log(body, "Hey I am another body");
    try {
      const email = body.email || "";
      // console.log(email);
      const document1 = await userModel.aggregate([
        {
          $match: {
            email: email,
            isEmailVerified: true,
          },
        },
      ]);
      // console.log(document1);
      const document = await userModel.findOne({
        contact: body.contact,
        countryCode: body.countryCode,
      });
      console.log(document1, "email exist");
      if (document1.length > 0) {
        return res.status(201).json({
          status: false,
          message: "Email already exist",
          code: 201,
        });
      } else if (document) {
        return res.status(201).json({
          status: false,
          message: "Mobile already exist",
          code: 201,
        });
      }
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }

    try {
      var data = {
        contact: body.contact,
        countryCode: body.countryCode,
        otp: "1234",
      };
      const document = new otpModel(data);
      document.save();
      console.log(document);
      let response = commonfunction.checkRes({ otp: data.otp });
      response.message = `${message.OTP_SENT}:${data.contact}`;
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      res.status(200).send(response);
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
  },

  // User Registration
  register: async (req, res) => {
    var body = req.body;
    try {
      var email = await userModel.aggregate([
        {
          $match: {
            email: body.email,
            isEmailVerified: true,
          },
        },
      ]);

      if (email.length > 0) {
        return res.json({
          status: false,
          code: 201,
          message: message.EMAIL_EXIST,
        });
      }
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: message.ANNONYMOUS,
      });
    }
    var longitude = parseFloat(body.longitude);
    var latitude = parseFloat(body.latitude);
    let data = {
      full_name: body.full_name,
      // userName: body.userName,
      email: body.email,
      password: body.password,
      contact: body.contact,
      countryCode: body.countryCode,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      role: body.role,
      // profile_pic: file,
      login_type: body.login_type,
      device_Token: body.device_Token,
      device_type: body.device_type,
      device_modal: body.device_modal,
      app_version: body.app_version,
      accessToken: "",
      address_name: body.address_name,
    };
    var user = new userModel(data);
    //  var date =  lib.moment().format("YYYY-MM");

    // password_hashing
    try {
      lib.bcrypt.genSalt(10, function (err, salt) {
        lib.bcrypt.hash(user.password, salt, async (err, hash) => {
          if (err) {
            logger.error(err);
          }
          var accessToken = lib.jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET
          );
          user.password = hash;
          user.accessToken = accessToken;
          var newUser = await user.save();
          try {
            var a = await otpModel.findOneAndUpdate(
              { contact: newUser.contact },
              { status: "1" }
            );

            // console.log(a, "a");
          } finally {
            let response = commonfunction.checkRes(newUser);
            response.message = `${message.OTP_SENT}:${newUser.contact}`;
            logger.info(
              `${req.url},${req.method},${req.hostname},${JSON.stringify(
                response.status
              )}`
            );
            res.status(200).send(response);
          }
        });
      });
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: message.ANNONYMOUS,
      });
    }
  },

  // Verify Email API
  sendLink: async (req, res) => {
    var body = req.body;
    try {
      var user = await userModel.findOne({ email: body.email });
      if (user) {
        const link = `${appCred.baseUrl}/user/emailverify/${user._id}`;
        var subject = "Recover Password";
        var message = `<html>
                                  <header>
                                  <title></title>
                                  </header>
                                  <body>
                                  <p>Hi, <br> This is the mail to verify your account (${user.email}) with hooked app App<br>
                                  Thanks,<br>Team Hooked App</p><br>
                                  <form action=${link}>
                                      <input type="submit"  value="Verify" />
                                  </form>
                                  </body>
                                </html>`;

        const transporter = lib.nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "Infoemailscheck@gmail.com",
            pass: "zoptal@123",
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        const mailOptions = {
          from: "Infoemailscheck@gmail.com",
          to: body.email,
          subject: subject,
          html: message,
        };
        console.log(link);
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            logger.error(JSON.stringify(error));
            console.log(error, "err");
          } else {
            logger.info(JSON.stringify(info));
            console.log("Email sent:" + info.response);
          }
        });
        response = commonfunction.checkRes(link);
        response.message = `${"Link send to your"}:${user.email}`;
        // console.log(response, "response");
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
      } else {
        response = commonfunction.checkRes(message.USER_NOT_FOUND);
        response.message = `${message.USER_NOT_FOUND}:${user.email}`;
        // console.log(response, "response");
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        // res.status(200).send(response);
      }
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
  },

  //  Verify Email Logic
  emailVerified: async (req, res) => {
    var userId = req.params.id;
    console.log(userId, "userId");
    try {
      var verify = await userModel.findOneAndUpdate(
        { _id: userId },
        { isEmailVerified: true }
      );
      return res.status(200).send(verify);
      console.log(verify, "verify");
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
  },

  // Resend OTP

  resendOtp: async (req, res) => {
    var body = req.body;
    console.log(body, "body");
    if (body.type == "1") {
      try {
        var emailexists = await userModel.aggregate([
          {
            $match: {
              email: body.email,
              isEmailVerified: true,
            },
          },
        ]);
        if (emailexists.length > 0) {
          return res.json({
            status: false,
            code: 201,
            message: message.EMAIL_EXIST,
          });
        }

        var contactexists = await userModel.aggregate([
          {
            $match: {
              contact: body.contact,
              countryCode: body.countryCode,
              isOtpVerified: true,
            },
          },
        ]);
        if (contactexists.length > 0) {
          return res.json({
            status: false,
            code: 201,
            message: message.PHONE_EXIST,
          });
        } else {
          var data = {
            contact: body.contact,
            countryCode: body.countryCode,
            otp: "4567",
            email: body.email,
          };
          const document = await otpModel(data);
          document.save();
          console.log(document);
          let response = commonfunction.checkRes({ otp: data.otp });
          response.message = `${message.OTP_SENT}:${data.contact}`;
          logger.info(
            `${req.url},${req.method},${req.hostname},${JSON.stringify(
              response.status
            )}`
          );
          return res.status(200).send(response);
        }
      } catch (e) {
        logger.error(e);
        return res.json({
          status: false,
          code: 201,
          message: message.ANNONYMOUS,
        });
      }
    } else if (body.type == "2") {
      try {
        var contact1 = await otpModel.aggregate([
          {
            $match: {
              contact: body.contact,
              countryCode: body.countryCode,
              isOtpVerified: true,
            },
          },
        ]);
        if (!contact1.length) {
          return res.json({
            status: false,
            code: 201,
            message: message.PHONE_NOT_EXIST,
          });
        } else {
          var data = {
            contact: body.contact,
            countryCode: body.countryCode,
            otp: "1234",
          };
          const document = new otpModel(data);
          document.save();
          console.log(document);
          let response = commonfunction.checkRes({ otp: data.otp });
          response.message = `${message.OTP_SENT}:${data.contact}`;
          logger.info(
            `${req.url},${req.method},${req.hostname},${JSON.stringify(
              response.status
            )}`
          );
          res.status(200).send(response);
        }
      } catch (e) {
        logger.error(e);
        return res.json({
          status: false,
          code: 201,
          message: message.ANNONYMOUS,
        });
      }
    }
  },

  // Verify OTP in OTP Model

  verifyOtp: async (req, res) => {
    var body = req.body;
    try {
      let updateotp=[]
      if (body.email) {
        console.log("we are here in mail");
      updateotp = await otpModel.aggregate([
        {
          $match: {
            email: body.email,
            otp: body.otp,
            isOtpVerified: false,
          },
        },
      ]);
    } else {
      console.log("we are here");
      updateotp = await otpModel.aggregate([
        {
          $match: {
            contact: body.contact,
            countryCode: body.countryCode,
            otp: body.otp,
            isOtpVerified: false,
          },
        },
      ]);
    }
      console.log(updateotp, "data -------------------");
      console.log(body , "hejehfjfjdfbdfjhvldfj")

      if (updateotp.length>0) {
        // var newOtp = " ";
        var verifyOtp = await otpModel.findOneAndUpdate(
          { _id: updateotp[0]._id },
          { otp: " " , isOtpVerified: true}
        );

        return res.json({
          status: true,
          code: 200,
          message: message.OTP_VERIFIED,
        });
      } else {
        return res.json({
          status: false,
          code: 201,
          message: message.OTP_NOT_VERIFIED,
        });
      }
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: message.ANNONYMOUS,
      });
    }
  },

  // Login Logic

  login: async (req, res) => {
    var body = req.body;
    var object = {};
    if (body.email) {
      object.email = body.email;
    } else {
      object.contact = body.contact;
    }
    const condition = object.email
      ? { email: object.email }
      : { contact: object.contact, countryCode: body.countryCode };
    try {
      var user = await userModel.findOne(condition);
      if (!user) {
        return res.json({
          status: false,
          code: 201,
          message: message.USER_NOT_FOUND,
        });
      }
      if (user.isEmailVerified == false && body.email) {
        return res.json({
          status: false,
          code: 202,
          message: message.ENV,
        });
      }
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: message.ANNONYMOUS,
      });
    }
    try {
      if (user && body.contact && body.contact == user.contact) {
        try {
          var otp = "1234";
          var newOtp = new otpModel({
            contact: body.contact,
            countryCode: body.countryCode,
            otp: otp,
          });
          newOtp.save();
          var accessToken = lib.jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET
          );

          var updateUser = await userModel.findOneAndUpdate(
            { _id: user._id },
            { accessToken: accessToken }
          );
          var userDetails = await userModel.findOne({ _id: user._id });
          const response = commonfunction.checkRes(userDetails);
          response.message = message.OTP_SENT;
          response.otp = otp;
          logger.info(`${req.url},${req.method},${req.hostname}`);
          return res.status(200).send(response);
        } catch (e) {
          logger.error(e);
          return res.json({
            status: false,
            code: 201,
            message: message.ANNONYMOUS,
          });
        }
      }
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: message.ANNONYMOUS,
      });
    }
    try {
      if (user && body.password) {
        console.log(user.password, "user.password");
        try {
          const validPassword = await lib.bcrypt.compare(
            body.password,
            user.password
          );
          console.log(validPassword, "validPassword");
          if (validPassword) {
            var Token = lib.jwt.sign(
              { email: body.email },
              process.env.JWT_SECRET
            );
            var updateUser = await userModel.findOneAndUpdate(
              { _id: user._id },
              { accessToken: Token }
            );

            var userDetails = await userModel.findOne({ _id: user._id });
            var response = commonfunction.checkRes(userDetails);
            response.message = message.LOGIN_SUCCESS;
            // response.accessToken = Token;
            console.log(response, "response");
            console.log(Token, "Token");
            logger.info(
              `${req.url},${req.method},${req.hostname},${res
                .status(200)
                .send(response)}`
            );
          } else {
            return res
              .status(201)
              .send({ status: false, code: 201, message: message.PWD_INC });
          }
        } catch (e) {
          logger.error(e);
          return res.json({
            status: false,
            code: 201,
            message: message.ANNONYMOUS,
          });
        }
      } else {
        return res.json({
          status: false,
          code: 201,
          message: message.INVALID_PASSWORD,
        });
      }
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: message.ANNONYMOUS,
      });
    }
  },

  // Logout  Logic

  logout: async (req, res, next) => {
    try {
      var b = await userModel.findOneAndUpdate(
        { _id: req.body.userId },
        { accessToken: " ", isOnline: false }
      );
      return res
        .status(200)
        .send({ status: true, code: 200, message: "logout successfully" });
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
  },

  // Forgot PAssword Logic

  forgot: async (req, res) => {
    var body = req.body;
    var a = function generateOTP() {
      var digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      return OTP;
      // console.log(a(), "a");
    };

    try {
      var email = await otpModel.findOne({ email: body.email });
      if (!email) {
        var message = "This email is not registered";
        return res
          .status(201)
          .send({ status: false, code: 201, message: message });
      } else if (email.isEmailVerified == false) {
        var message = "This email is not verified";
        return res
          .status(202)
          .send({ status: false, code: 202, message: message });
      } else {
        try {
          var otp = a();
          var newOtp = await otpModel.findOneAndUpdate(
            { email: body.email },
            { otp: otp }
          );
          var message = "OTP sent to your email";
          res.status(200).send({ status: true, code: 200, message: message });

          var subject = "OTP for forgot password";
          var message = ` <html>
          <header>
          <title>OTP for forgot password</title>
          </header>
          <body>
          <p>Your OTP is ${otp}</p>
          </body>
          </html>`;

          const transporter = lib.nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "Infoemailscheck@gmail.com",
              pass: "zoptal@123",
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          const mailOptions = {
            from: "Infoemailscheck@gmail.com",
            to: body.email,
            subject: subject,
            html: message,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              logger.error(JSON.stringify(error));
              console.log(error);
            } else {
              logger.info("Email sent: " + info.response);
              console.log("Email sent: " + info.response);
            }
          });
        } catch (e) {
          logger.error(e);
          res
            .status(201)
            .send({ status: false, code: 201, message: message.ANNONYMOUS });
        }
      }
    } catch (e) {
      logger.error(e);
      res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Reset Password Logic

  resetpassword: async (req, res) => {
    var body = req.body;
    console.log(body, "body");
    try {
      var otp = await userModel.findOne({ email: body.email });
      console.log(otp, "otp");
      if (!otp) {
        var message = "This email is not registered";
        return res
          .status(201)
          .send({ status: false, code: 201, message: message });
      } else if (otp.isEmailVerified == false) {
        var message = "This email is not verified";
        return res.status(202).send({ status: false, code: 202, message: message });
      } else {
        try {
          lib.bcrypt.genSalt(10, function (err, salt) {
            lib.bcrypt.hash(body.password, salt, async (err, hash) => {
              if (err) {
                logger.error(err);
                return res.status(201).send(err);
              } else {
                var updateUser = await userModel.findOneAndUpdate(
                  { _id: otp._id },
                  { password: hash }
                );
                var message = "Password reset successfully";
                res.status(200).send({ status: true, code: 200, message: message });
              }
            });
          });
        } catch (e) {
          logger.error(e);
          return res
            .status(201)
            .send({ status: false, code: 201, message: message.ANNONYMOUS });
        }
      }
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Change Password Logic

  changePassword: async (req, res) => {
    var body = req.body;
    console.log(body, "hsfjhgfksgf<fgshgjsghgsh");
    try {
      var user = await userModel.findOne({ _id: body.userId });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
    if (user) {
      const validPassword = lib.bcrypt.compare(
        body.old_password,
        user.password
      );
      if (validPassword) {
        try {
          lib.bcrypt.genSalt(10, (err, salt) => {
            lib.bcrypt.hash(body.new_password, salt, async (err, hash) => {
              if (err) {
                logger.error(err);
              }
              body.new_password = hash;
              var updatePassword = await userModel.findOneAndUpdate(
                { _id: body.userId },
                { password: body.new_password }
              );
              logger.info(
                `url:${req.url},method:${req.method},host:${
                  req.hostname
                },status:${JSON.stringify({ status: true })}`
              );
              return res.status(200).send({
                status: true,
                code: 200,
                message: message.PWD_CHANGED,
              });
            });
          });
        } catch (e) {
          logger.error(e);
          return res
            .status(201)
            .send({ status: false, code: 201, message: message.ANNONYMOUS });
        }
      } else {
        return res
          .status(201)
          .send({ status: false, code: 201, message: message.OLD_PASSWORD });
      }
    } else {
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.USER_NOT_FOUND });
    }
  },

  // Update Profile

  updateProfile: async (req, res) => {
    var body = req.body;
    var file = req.file;
    try {
      var data = {};
      var image = "";
      if (!file) {
        image = "";
      } else {
        image = file.filename;
      }
      var longitude = parseFloat(body.longitude);
      var latitude = parseFloat(body.latitude);
      if (longitude && latitude) {
        if (!image == "") {
          data = {
            full_name: body.full_name,
            email: body.email,
            contact: body.contact,
            designation: body.designation,
            languages: body.languages,
            identification: body.identification,
            superHost: body.superHost,
            countryCode: body.countryCode,
            profile_pic: image,
            about: body.about,
            address_name: body.address_name,
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          };
        } else {
          data = {
            full_name: body.full_name,
            email: body.email,
            designation: body.designation,
            languages: body.languages,
            identification: body.identification,
            superHost: body.superHost,
            contact: body.contact,
            countryCode: body.countryCode,
            about: body.about,
            address_name: body.address_name,
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          };
        }
      } else {
        if (!image == "") {
          data = {
            full_name: body.full_name,
            email: body.email,
            contact: body.contact,
            countryCode: body.countryCode,
            languages: body.languages,
            identification: body.identification,
            superHost: body.superHost,
            profile_pic: image,
            designation: body.designation,
            about: body.about,
            address_name: body.address_name,
          };
        } else {
          data = {
            full_name: body.full_name,
            email: body.email,
            contact: body.contact,
            countryCode: body.countryCode,
            languages: body.languages,
            identification: body.identification,
            superHost: body.superHost,
            about: body.about,
            address_name: body.address_name,
            designation: body.designation,
          };
        }
      }

      var update = await userModel.findOneAndUpdate(
        { userId: body.userId },
        data
      );

      console.log(update, "dfhsgfhjfhf");
      var updatedData = await userModel.findOne({ _id: update._id });
      updatedData.save();
      const response = commonfunction.checkRes(updatedData);
      response.message = "User profile updated successfully";
      logger.info(
        `url:${req.url},method:${req.method},host:${
          req.hostname
        },status:${JSON.stringify({ status: true })}`
      );
      return res.status(200).send(response);
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
  },

  uploadGovtid: async (req, res) => {
    console.log(req.files, "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")
    try {
      var user = await userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
    var body = req.body;
    var file = req.files;
   
    try {
      var img = [];
      for (const obj of file) {
        var i = `uploads/${obj.filename}`;
        img.push(i);
      }

      var data = {
        govternmentId: img,
        type: body.type,
        userId:user._id
      };

      var uploadId = new govtIdModel(data);
      uploadId.save();
      return res.status(200).send({ status: true, code: 200, message: message.UPLOAD_GOVTID });
    } catch (e) {
      logger.error(e);
      return res.status(201).send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  updateGovtId : async (req, res) => {

    try {
      var user = await userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
    var body = req.body;
    var file = req.files;
    try {
      var img = [];
      for (const obj of file) {
        var i = `uploads/${obj.filename}`;
        img.push(i);
      }

      var data = {
        govternmentId: img,
        type: body.type,
        userId:user._id
      };

      var uploadId = await govtIdModel.findOneAndUpdate({userId:user._id},data);
      uploadId.save();
      return res.status(200).send({ status: true, code: 200, message: message.UPLOAD_GOVTID });
    } catch (e) {
      logger.error(e);
      return res.status(201).send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

  },

  interstedIn: async (req, res) => {
    try {
      var user = await userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
    var interests = req.interests;

    var body = req.body;
    // console.log(body, "7777777777777777777777777777777777777777")
    try {
      var interestedIn = [];
      for (const obj of body.interests) {
        var a = {
          isSelect:true,
          id:obj
        }
        interestedIn.push(a);
      }

      console.log(interestedIn, "this is the data created ")

      var interstedIn = await userModel.findOneAndUpdate({ _id: user._id }, { interests: interestedIn });
      console.log(interstedIn, "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
      interstedIn.save();
      return res.status(200).send({ status: true, code: 200, message: message.INTERESTED_IN });
    } catch (e) {
      logger.error(e);
      return res.status(201).send({ status: false, code: 201, message: message.ANNONYMOUS });
    }


  },

  addvehicle : async (req, res) => {
    try {
      var user = await userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
    var vehicles = req.vehicles;

    var body = req.body;
    try {
      var addvehicle = [];
      for (const obj of body.vehicles) {
        var a = {
          isSelect:true,
          addvehicle:obj
        }
        addvehicle.push(a);
      }
      var interstedIn = await userModel.findOneAndUpdate({ _id: user._id }, { vehicles: addvehicle });
      // interstedIn.save();
      return res.status(200).send({ status: true, code: 200, message: message.INTERESTED_IN });
    } catch (e) {
      logger.error(e);
      return res.status(201).send({ status: false, code: 201, message: message.ANNONYMOUS });
    }


  },

  amenities : async (req, res) => {
    try {
      var user = await userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
    var amenities = req.amenities;

    var body = req.body;
    try {
      var addAmenities = [];
      for (const obj of body.amenities) {
        var a = {
          isSelect:true,
          addAmenities:obj
        }
        addAmenities.push(a);
        var data = {
          amenities: addAmenities,
          radius : body.radius,
        }
      }
      var interstedIn = await userModel.findOneAndUpdate({ _id: user._id }, data);
      // interstedIn.save();
      return res.status(200).send({ status: true, code: 200, message: message.INTERESTED_IN });
    } catch (e) {
      logger.error(e);
      return res.status(201).send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

  },

  // Get the list of interest, vehicle, and amenities

  getdata : async (req, res) => {
    try {
      var user = await userModel.findOne({
        accessToken: req.headers["x-token"],
      });

      // console.log(req.body, "Hello I am the hakuna matata");
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

    var body = req.body;
    try {
      if(req.query.status ==1){    // 1 for Interested In
       var data=await interestModel.find({});
       const response = commonfunction.checkRes(data);
       response.message = "Amenities list fetched successfully";
       logger.info(
         `url:${req.url},method:${req.method},host:${
           req.hostname
         },status:${JSON.stringify({ status: true })}`
       );
       return res.status(200).send(response);
      }
      if(req.query.status ==2){    // 2 for Vehicle
        var data=await vehicleModel.find({});
        const response = commonfunction.checkRes(data);
        response.message = "Vehicle list fetched successfully";
        logger.info(
          `url:${req.url},method:${req.method},host:${
            req.hostname
          },status:${JSON.stringify({ status: true })}`
        );
        return res.status(200).send(response);
      }
      if(req.query.status ==3){    // 3 for Amenities
        var data=await amenitiesModel.find({});
        const response = commonfunction.checkRes(data);
        response.message = "Amenities list fetched successfully";
        logger.info(
          `url:${req.url},method:${req.method},host:${
            req.hostname
          },status:${JSON.stringify({ status: true })}`
        );
        return res.status(200).send(response);
      }
    }
    catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

  },

  /*****************************ADD PROPERTY******************************************* */

  // Add Property

  addproperty1: async (req, res) => {
    try {
      var user = await userModel.findOne({
        accessToken: req.headers["x-token"],
      });

      console.log(req.body, "Hello I am the hakuna matata");
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

    var body = req.body;

    // console.log(req.body, "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    try {
      var data = {
        userId: user._id,
        property_type: body.property_type,
        add_title: body.add_title,
        add_description: body.add_description,
        amenities: body.amenities,
        activities: body.activities,
      };
      // console.log(data.amenities, "Hello I am the amenities");
      // console.log(data, "Hey! I am data....");
      var property = new propertyModel(data);
      var save_property = await property.save();
      var response = commonfunction.checkRes(property._id);
      res
        .status(200)
        .send({
          status: true,
          code: 200,
          propertyId: property._id,
          message: "List Added Succesfully",
        });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Add Property 2

  addproperty2: async (req, res) => {
    try {
      var property = await propertyModel.findOne({ _id: req.propertyId });
      // console.log(user,"Hello I am the userrr");
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

    var body = req.body;
    var longitude = parseFloat(body.longitude);
    var latitude = parseFloat(body.latitude);

    console.log(body, "Hey! I am body....");

    try {
      var data = {
        guests:{adults : body.adults,
        bedrooms : body.bedrooms,
        washrooms : body.washrooms,},
        // guests: body.guests,
        not_to_bring: body.not_to_bring,
        rules: body.rules,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        co_host: body.co_host,
      };

      // var userId = body._id;
      // console.log(data, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

      var property = await propertyModel.updateMany({_id: body.propertyId }, data);

      // property.save();
      console.log(data, "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",property);
      var response = commonfunction.checkRes(property);
      res
        .status(200)
        .send({
          status: true,
          code: 200,
          propertyId: property._id,
          message: "Added Successfully",
        });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Upload Pictures and set price

  addproperty3: async (req, res) => {
    try {
      var pictures = await propertyModel.findOne({ _id: req.propertyId });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

    var body = req.body;
    var file = req.files;

    // console.log(body, "Hey! I am body....");

    try {
      var img = [];
      for (const obj of file) {
        var i = `uploads/${obj.filename}`;
        img.push(i);
      }

      var data = {
        pictures: img,
        price: body.price,
      };

      var pictures = await propertyModel.findOneAndUpdate(
        { _id: body.propertyId },
        data
      );
      // console.log(pictures,"Hey! I am property....");
      // pictures.save();

      var response = commonfunction.checkRes(pictures);
      res
        .status(200)
        .send({
          status: true,
          code: 200,
          propertyId: pictures._id,
          message: "Added successfully",
        });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Select dates

  selectDates: async (req, res) => {
    try {
      var dates = await propertyModel.findOne({ _id: req.propertyId });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

    var body = req.body;
    console.log(body, "data");
    try {
      var selectDates = await propertyModel.findOneAndUpdate(
        { _id: body.propertyId },
        {
          select_dates: {
            start_date: body.start_date,
            end_date: body.end_date,
          },
        }
      );

      // selectDates.save();
      var response = commonfunction.checkRes(selectDates);
      res
        .status(200)
        .send({
          status: true,
          code: 200,
          propertyId: selectDates._id,
          message: "Dates Added",
        });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Fetch Property Details

  fetchPropertyDetails: async (req, res) => {
    var propertyId = req.query["propertyId"];
    console.log(propertyId, "data");

    try {
      var property = await propertyModel.aggregate([
        {
          $match: {
            _id: lib.mongoose.Types.ObjectId(propertyId),
          },
        },
        {
          $skip: 0,
        },
        {
          $limit: 1,
        },
        {
          $project: {
            "Property Name": "$add_title",
            "Property Pictures": "$pictures",
            Price: "$price",
          },
        },
      ]);
      var response = commonfunction.checkRes(property);
      res
        .status(200)
        .send({
          status: true,
          code: 200,
          property: property,
          message: "Property Details",
        });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  //  Property Details

  propertyDetails: async (req, res) => {
    // var body = req.body;
    var propertyId = req.query["propertyId"];
    console.log(propertyId, "data");
    try {
      var property = await propertyModel.aggregate([
        {
          '$match': {
            '_id': lib.mongoose.Types.ObjectId(propertyId),
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'userId', 
            'foreignField': '_id', 
            'as': 'Data'
          }
        }, {
          '$unwind': {
            'path': '$Data', 
            'includeArrayIndex': 'string', 
            'preserveNullAndEmptyArrays': false
          }
        }, {
          '$lookup': {
            'from': 'rules', 
            'localField': 'rules._id', 
            'foreignField': 'string', 
            'as': 'Rules'
          }
        }, {
          '$unwind': {
            'path': '$rules', 
            'includeArrayIndex': 'string', 
            'preserveNullAndEmptyArrays': false
          }
        }, {
          '$lookup': {
            'from': 'cancellationpolicies', 
            'localField': 'cancellationpolicies', 
            'foreignField': 'n', 
            'as': 'Cancellationpolicies'
          }
        }, {
          '$unwind': {
            'path': '$Cancellationpolicies', 
            'includeArrayIndex': 'string', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$unwind': {
            'path': '$amenities', 
            'includeArrayIndex': 'gf', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'amenities', 
            'localField': 'amenities', 
            'foreignField': '_id', 
            'as': 'ami'
          }
        }, {
          '$unwind': {
            'path': '$ami', 
            'includeArrayIndex': 'cdf', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$group': {
            '_id': '$_id', 
            'amenities': {
              '$push': '$ami'
            }, 
            'userId': {
              '$first': '$userId'
            }, 
            'activities': {
              '$first': '$activities'
            }, 
            'property_type': {
              '$first': '$property_type'
            }, 
            'add_title': {
              '$first': '$add_title'
            }, 
            'add_description': {
              '$first': '$add_description'
            }, 
            'guests': {
              '$first': '$guests'
            }, 
            'rules': {
              '$first': '$rules'
            }, 
            'co_host': {
              '$first': '$co_host'
            }, 
            'pictures': {
              '$first': '$pictures'
            }, 
            'price': {
              '$first': '$price'
            }, 
            'select_dates': {
              '$first': '$select_dates'
            }, 
            'locations': {
              '$first': '$location'
            }, 
            'Data': {
              '$first': '$Data'
            }, 
            'Cancellation Policies': {
              '$first': '$Cancellationpolicies'
            }, 
            'Not To bring': {
              '$first': '$not_to_bring'
            }
          }
        }, {
          '$unwind': {
            'path': '$activities', 
            'includeArrayIndex': 'd', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'activities', 
            'localField': 'activities', 
            'foreignField': '_id', 
            'as': 'acti'
          }
        }, {
          '$unwind': {
            'path': '$acti', 
            'includeArrayIndex': 'dd', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$group': {
            '_id': '$_id', 
            'amenities': {
              '$first': '$amenities'
            }, 
            'userId': {
              '$first': '$userId'
            }, 
            'activities': {
              '$push': '$acti'
            }, 
            'property_type': {
              '$first': '$property_type'
            }, 
            'add_title': {
              '$first': '$add_title'
            }, 
            'add_description': {
              '$first': '$add_description'
            }, 
            'guests': {
              '$first': '$guests'
            }, 
            'rules': {
              '$first': '$rules'
            }, 
            'co_host': {
              '$first': '$co_host'
            }, 
            'pictures': {
              '$first': '$pictures'
            }, 
            'price': {
              '$first': '$price'
            }, 
            'select_dates': {
              '$first': '$select_dates'
            }, 
            'locations': {
              '$first': '$locations'
            }, 
            'Data': {
              '$first': '$Data'
            }, 
            'Cancellation Policies': {
              '$first': '$Cancellation Policies'
            }, 
            'Not To Bring': {
              '$first': '$Not To bring'
            }
          }
        }, {
          '$unwind': {
            'path': '$propertytypes', 
            'includeArrayIndex': 'string', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'propertytypes', 
            'localField': 'property_type', 
            'foreignField': '_id', 
            'as': 'property'
          }
        }, {
          '$unwind': {
            'path': '$property', 
            'includeArrayIndex': 'string', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$group': {
            '_id': '$_id', 
            'amenities': {
              '$first': '$amenities'
            }, 
            'userId': {
              '$first': '$userId'
            }, 
            'activities': {
              '$first': '$activities'
            }, 
            'property': {
              '$push': '$property'
            }, 
            'add_title': {
              '$first': '$add_title'
            }, 
            'add_description': {
              '$first': '$add_description'
            }, 
            'guests': {
              '$first': '$guests'
            }, 
            'rules': {
              '$first': '$rules'
            }, 
            'co_host': {
              '$first': '$co_host'
            }, 
            'pictures': {
              '$first': '$pictures'
            }, 
            'price': {
              '$first': '$price'
            }, 
            'select_dates': {
              '$first': '$select_dates'
            }, 
            'locations': {
              '$first': '$locations'
            }, 
            'Data': {
              '$first': '$Data'
            }, 
            'Cancellation Policies': {
              '$first': '$Cancellation Policies'
            }, 
            'Not to Bring': {
              '$first': '$Not To Bring'
            }
          }
        }, {
          '$lookup': {
            'from': 'propertyreviews', 
            'let': {
              'id': '$_id'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$propertyId', '$$id'
                    ]
                  }
                }
              }, {
                '$lookup': {
                  'from': 'users', 
                  'let': {
                    'id': '$userId'
                  }, 
                  'pipeline': [
                    {
                      '$match': {
                        '$expr': {
                          '$eq': [
                            '$_id', '$$id'
                          ]
                        }
                      }
                    }
                  ], 
                  'as': 'users'
                }
              }, {
                '$unwind': '$users'
              }, {
                '$project': {
                  'full_name': '$users.full_name', 
                  'profile_pic': '$users.profile_pic', 
                  'propertyId': 1, 
                  'review': 1, 
                  'ratings': {
                    '$convert': {
                      'input': '$rating', 
                      'to': 'double'
                    }
                  }, 
                  '_id': 1, 
                  'timestamp': 1
                }
              }, {
                '$group': {
                  '_id': '$_id', 
                  'full_name': {
                    '$first': '$full_name'
                  }, 
                  'profile_pic': {
                    '$first': '$profile_pic'
                  }, 
                  'propertyId': {
                    '$first': '$propertyId'
                  }, 
                  'review': {
                    '$first': '$review'
                  }, 
                  'rating': {
                    '$first': '$ratings'
                  }
                }
              }
            ], 
            'as': 'propertyreviews'
          }
        }, {
          '$unwind': {
            'path': '$propertyreviews', 
            'includeArrayIndex': 'hsg', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$group': {
            '_id': '$propertyreviews.propertyId', 
            'propertyId': {
              '$first': '$_id'
            }, 
            'amenities': {
              '$first': '$amenities'
            }, 
            'userId': {
              '$first': '$userId'
            }, 
            'activities': {
              '$first': '$activities'
            }, 
            'property': {
              '$first': '$property'
            }, 
            'add_title': {
              '$first': '$add_title'
            }, 
            'add_description': {
              '$first': '$add_description'
            }, 
            'guests': {
              '$first': '$guests'
            }, 
            'rules': {
              '$first': '$rules'
            }, 
            'co_host': {
              '$first': '$co_host'
            }, 
            'pictures': {
              '$first': '$pictures'
            }, 
            'price': {
              '$first': '$price'
            }, 
            'select_dates': {
              '$first': '$select_dates'
            }, 
            'locations': {
              '$first': '$locations'
            }, 
            'Data': {
              '$first': '$Data'
            }, 
            'Cancellation Policies': {
              '$first': '$Cancellation Policies'
            }, 
            'Not to Bring': {
              '$first': '$Not to Bring'
            }, 
            'rating_sum': {
              '$sum': '$propertyreviews.rating'
            }, 
            'totalDoc': {
              '$count': {}
            }, 
            'propertyreviews': {
              '$push': '$propertyreviews'
            }
          }
        }, {
          '$lookup': {
            'from': 'hostreviews', 
            'let': {
              'id': '$userId'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$userId', '$$id'
                    ]
                  }
                }
              }, {
                '$lookup': {
                  'from': 'users', 
                  'let': {
                    'id': '$userId'
                  }, 
                  'pipeline': [
                    {
                      '$match': {
                        '$expr': {
                          '$eq': [
                            '$_id', '$$id'
                          ]
                        }
                      }
                    }
                  ], 
                  'as': 'users'
                }
              }, {
                '$unwind': '$users'
              }, {
                '$project': {
                  'full_name': '$users.full_name', 
                  'profile_pic': '$users.profile_pic', 
                  '_id': 1, 
                  'review': 1, 
                  'ratings': {
                    '$convert': {
                      'input': '$rating', 
                      'to': 'double'
                    }
                  }, 
                  'timestamp': 1, 
                  'hostId': 1
                }
              }, {
                '$group': {
                  '_id': '$_id', 
                  'full_name': {
                    '$first': '$full_name'
                  }, 
                  'profile_pic': {
                    '$first': '$profile_pic'
                  }, 
                  'hostId': {
                    '$first': '$hostId'
                  }, 
                  'review': {
                    '$first': '$review'
                  }, 
                  'rating': {
                    '$first': '$ratings'
                  }
                }
              }
            ], 
            'as': 'hostreviews'
          }
        }, {
          '$unwind': {
            'path': '$hostreviews', 
            'includeArrayIndex': 'string', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$group': {
            '_id': '$hostreviews.hostId', 
            'propertyId': {
              '$first': '$propertyId'
            }, 
            'amenities': {
              '$first': '$amenities'
            }, 
            'userId': {
              '$first': '$userId'
            }, 
            'activities': {
              '$first': '$activities'
            }, 
            'property': {
              '$first': '$property'
            }, 
            'add_title': {
              '$first': '$add_title'
            }, 
            'add_description': {
              '$first': '$add_description'
            }, 
            'guests': {
              '$first': '$guests'
            }, 
            'rules': {
              '$first': '$rules'
            }, 
            'co_host': {
              '$first': '$co_host'
            }, 
            'pictures': {
              '$first': '$pictures'
            }, 
            'price': {
              '$first': 'price'
            }, 
            'select_dates': {
              '$first': '$select_dates'
            }, 
            'location': {
              '$first': '$locations'
            }, 
            'propertyreview': {
              '$first': '$propertyreviews'
            }, 
            'totalDoc': {
              '$first': '$totalDoc'
            }, 
            'rating_sum': {
              '$first': '$rating_sum'
            }, 
            'Data': {
              '$first': '$Data'
            }, 
            'Cancellation Policies': {
              '$first': '$Cancellation Policies'
            }, 
            'Not to Bring': {
              '$first': '$Not to Bring'
            }, 
            'Hostrating_sum': {
              '$sum': '$hostreviews.rating'
            }, 
            'hostTotalDoc': {
              '$count': {}
            }, 
            'hostreviews': {
              '$push': '$hostreviews'
            }
          }
        }, {
          '$project': {
            'FullName': '$Data.full_name', 
            'Property Images': '$pictures', 
            'Property Name': '$add_title', 
            'Profile Picture': '$Data.profile_pic', 
            'Price': '$price', 
            'BedRooms': '$guests.bedrooms', 
            'WashRooms': '$guests.washrooms', 
            'Descriptions': '$add_description', 
            'Not to Bring': '$Not to Bring', 
            'Amenities': '$amenities', 
            'Activities': '$activities', 
            'Rules': '$rules', 
            'Cancellation Policy': '$Cancellation Policies', 
            'Co-Host': '$co_host', 
            'propertyreviews': 1, 
            'propertyreviewsAverage': {
              '$divide': [
                '$rating_sum', '$totalDoc'
              ]
            }, 
            'hostreviewsAverage': {
              '$divide': [
                '$Hostrating_sum', '$hostTotalDoc'
              ]
            }, 
            'propertyId': 1, 
            '_id': 0
          }
        }
      ]);

      const propertyDetails = Object.assign({}, ...property);
      console.log(propertyDetails, " Ths is the Property Details");
      // var response = commonfunction.checkRes(propertyDetails);
      res
        .status(200)
        .send({
          status: true,
          code: 200,
          property: propertyDetails,
          message: "Property Details",
        });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Fetch Host Data

  getProfile: async (req, res) => {
    var hostId = req.query["userId"];

    try {
      var hostdata = await userModel.aggregate([
        {
          $match: {
            _id: new ObjectId(hostId),
          },
        },
        {
          $lookup: {
            from: "hostreviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$hostId", "$$id"],
                  },
                },
              },
              {
                $project: {
                  ratings: {
                    $convert: {
                      input: "$rating",
                      to: "double",
                    },
                  },
                },
              },
            ],
            as: "host",
          },
        },
        {
          $unwind: {
            path: "$host",
            includeArrayIndex: "string",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "hostreviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$hostId", "$$id"],
                  },
                },
              },
              {
                $lookup: {
                  from: "users",
                  let: {
                    id: "$userId",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$id"],
                        },
                      },
                    },
                  ],
                  as: "reviewer",
                },
              },
              {
                $unwind: "$reviewer",
              },
              {
                $project: {
                  Fullname: "$reviewer.full_name",
                  profile_pic: "$reviewer.profile_pic",
                  hostId: 1,
                  review: 1,
                  ratings: {
                    $convert: {
                      input: "$rating",
                      to: "double",
                    },
                  },
                },
              },
              {
                $sort: {
                  _id: -1,
                },
              },
              {
                $limit: 2,
              },
            ],
            as: "hostreviews",
          },
        },
        {
          $group: {
            _id: "$_id",
            fullName: {
              $first: "$full_name",
            },
            email: {
              $first: "$email",
            },
            contact: {
              $first: "$contact",
            },
            countryCode: {
              $first: "$countryCode",
            },
            isOtpVerified: {
              $first: "$isOtpVerified",
            },
            isEmailVerified: {
              $first: "$isEmailVerified",
            },
            login_type: {
              $first: "$login_type",
            },
            Address: {
              $first: "$address_name",
            },
            about: {
              $first: "$about",
            },
            type: {
              $first: "$type",
            },
            profile_pic: {
              $first: "$profile_pic",
            },
            designation: {
              $first: "$designation",
            },
            identification: {
              $first: "$identification",
            },
            languages: {
              $first: "$languages",
            },
            superhost: {
              $first: "$superHost",
            },
            reviews: {
              $first: "$hostreviews",
            },
            rating_sum: {
              $sum: "$host.ratings",
            },
            totalDoc: {
              $count: {},
            },
          },
        },
        {
          $project: {
            fullname: "$fullName",
            email: "$email",
            contact: "$contact",
            countryCode: "$countryCode",
            isOtpVerified: "$isOtpVerified",
            isEmailVerified: "$isEmailVerified",
            loginType: "$login_type",
            Address: "$Address",
            about: "$about",
            type: "$type",
            profilePic: "$profile_pic",
            designation: "$designation",
            identification: "$identification",
            languages: "$languages",
            superhost: "$superhost",
            reviews: 1,
            Average_rating: {
              $divide: ["$rating_sum", "$totalDoc"],
            },
          },
        },
      ]);
      var response = commonfunction.checkRes(hostdata);
      res
        .status(200)
        .send({
          status: true,
          code: 200,
          message: "Host Data",
          data: response,
        });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Fetch All Review

  allPropertyReviews: async (req, res) => {
    var propertyId = req.query["propertyId"];
    console.log(propertyId, "data");
    try {
      var property = await PropertyReviewModel.aggregate([
        {
          $lookup: {
            from: "users",
            let: {
              id: "$userId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$id"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  Fullname: "$full_name",
                  "Profile Pic": "$profile_pic",
                },
              },
            ],
            as: "users",
          },
        },
        {
          $unwind: {
            path: "$users",
            includeArrayIndex: "string",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            FullName: "$users.Fullname",
            "Profile Picture": "$users.Profile Pic",
            Review: "$review",
            Rating: "$rating",
          },
        },
      ]);
      const allPropertyReview = Object.assign({}, ...property);
      console.log(allPropertyReview, " Ths is the Property Details");
      // var response = commonfunction.checkRes(propertyDetails);
      res
        .status(200)
        .send({
          status: true,
          code: 200,
          property: allPropertyReview,
          message: "Property Details",
        });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Property Review Logic

  propertyReview: async (req, res) => {
    var body = req.body;
    console.log(body, "This is the body");
    try {
      var propertyReview = await PropertyReviewModel.aggregate([
        {
          $match: {
            userId: lib.mongoose.Types.ObjectId(body.userId),
            propertyId: lib.mongoose.Types.ObjectId(body.propertyId),
          },
        },
      ]);
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

    try {
      if (propertyReview.length > 0) {
        var update = await PropertyReviewModel.findOneAndUpdate(
          {
            _id: propertyReview[0]._id,
          },
          {
            review: body.review,
            rating: body.rating,
          },
          {
            new: true,
          }
        );
        res.send(update);
      } else {
        var data = {
          userId: body.userId,
          review: body.review,
          propertyId: body.propertyId,
          rating: body.rating,
        };
        var add = new PropertyReviewModel(data);
        await add.save();
        return res.send(add);
      }
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Add Host Review

  addHostReview: async (req, res) => {
    var body = req.body;
    console.log(body, "This is the body");
    try {
      var hostReview = await HostReviewModel.aggregate([
        {
          $match: {
            userId: lib.mongoose.Types.ObjectId(body.userId),
          },
        },
      ]);
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

    try {
      if (hostReview.length > 0) {
        var update = await HostReviewModel.findOneAndUpdate(
          {
            _id: hostReview[0]._id,
          },
          {
            review: body.review,
            rating: body.rating,
          },
          {
            new: true,
          }
        );
        res.send(update);
      } else {
        var data = {
          userId: body.userId,
          hostId: body.hostId,
          review: body.review,
          rating: body.rating,
        };
        var add = new HostReviewModel(data);
        await add.save();
        return res.send(add);
      }
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Send FeedBack to the host Email

  sendFeedBack: async (req, res) => {
    var body = req.body;
    try {
      var user = await userModel.findOne({ _id: body.userId });

      var subject = "Getting FeedBack";
      var message = `<html>
                              <header>
                              <title></title>
                              </header>
                              <body>
                              <p>Hi, <br> This is the Feedback from (${user.full_name})<br>
                              </p><br>
                              </body>
                            </html>`;

      const transporter = lib.nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "Infoemailscheck@gmail.com",
          pass: "zoptal@123",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const mailOptions = {
        from: user.email,
        to: "admin@parknb.com",
        subject: subject,
        html: message,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      var data = {
        userId: body.userId,
        title: body.title,
        description: body.description,
      };

      var feedback = new FeedbackModel(data);
      await feedback.save();
      res.send(feedback);
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Add Favorite

  favoriteProperty: async (req, res) => {
    var body = req.body;

    try {
      var favorite = await favoriteModel.aggregate([
        {
          $match: {
            userId: lib.mongoose.Types.ObjectId(body.userId),
            propertyId: lib.mongoose.Types.ObjectId(body.propertyId),
          },
        },
      ]);
    } catch (e) {
      logger.error(e);
      res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

    try {
      if (favorite.length > 0) {
        for (const obj of favorite) {
          if (obj.userId == body.userId) {
            var removeFavorite = await favoriteModel.findByIdAndRemove({
              _id: obj._id,
            });
            let response = commonfunction.checkRes(removeFavorite);
            response.message = "Removed the Event from Favorite";
            res.status(200).send(response);
            logger.info(
              `url:${req.url},method:${req.method},host:${
                req.hostname
              },status:${JSON.stringify(response.status)}`
            );
          }
        }
      } else {
        try {
          var property = await propertyModel.findOne({ _id: body.propertyId });
        } catch (e) {
          logger.error(e);
          res
            .status(201)
            .send({ status: false, code: 201, message: message.ANNONYMOUS });
        }
        try {
          var data = {
            userId: body.userId,
            propertyId: body.propertyId,
            property_type: "",
            // type: body.type,
          };
          // if (property. == true) {
          //   data.eventType = "private";
          // } else {
          //   data.eventType = "public";
          // }
          // let like = true;
          // if (body.type == "1") {
          //   like = true;
          // } else {
          //   like = false;
          // }

          var d = {
            userId: body.userId,
            eventId: body.propertyId,
            // like: like,
            // eventType:data.eventType
          };
          // var newLike = new likeModel(d);
          // newLike.save();
          var Favorite1 = new favoriteModel(data);
          var favoriteProperty = await Favorite1.save();
          let response = commonfunction.checkRes(favoriteProperty);

          // var favoriteEvent=await Favorite1.save();
          // let response=commonfunction.checkRes(Favorite1);
          response.message = "Added the Event to Favorite";
          res.status(200).send(response);
          logger.info(
            `url:${req.url},method:${req.method},host:${
              req.hostname
            },status:${JSON.stringify(response.status)}`
          );
        } catch (e) {
          logger.error(e);
          res
            .status(201)
            .send({ status: false, code: 201, message: message.ANNONYMOUS });
        }
      }
    } catch (e) {
      logger.error(e);
      res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Become superHost

  superhost : async (req, res) => {

    try {
      var user = await userModel.findOne({
        accessToken: req.headers["x-token"],
      });

      console.log(user, "Hello I am the userrr");
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

    try {

      var criteria = await userModel.aggregate(
        [
          {
            '$match': {
              '_id': mongoose.Types.ObjectId(user._id),
            }
          }, {
            '$lookup': {
              'from': 'addproperties', 
              'let': {
                'id': '$_id'
              }, 
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      '$eq': [
                        '$userId', '$$id'
                      ]
                    }
                  }
                }
              ], 
              'as': 'Property'
            }
          }, {
            '$lookup': {
              'from': 'confirmedbookings', 
              'let': {
                'id': '$_id'
              }, 
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      '$eq': [
                        '$userId', '$$id'
                      ]
                    }
                  }
                }, {
                  '$project': {
                    'price': {
                      '$convert': {
                        'input': '$price', 
                        'to': 'double'
                      }
                    }
                  }
                }, {
                  '$group': {
                    '_id': '_id', 
                    'total': {
                      '$sum': '$price'
                    }
                  }
                }
              ], 
              'as': 'booking'
            }
          }, {
            '$unwind': {
              'path': '$booking', 
              'includeArrayIndex': 'string', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$lookup': {
              'from': 'hostreviews', 
              'let': {
                'id': '$_id'
              }, 
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      '$eq': [
                        '$userId', '$$id'
                      ]
                    }
                  }
                }, {
                  '$project': {
                    'rating': {
                      '$convert': {
                        'input': '$rating', 
                        'to': 'double'
                      }
                    }
                  }
                }, {
                  '$group': {
                    '_id': '_id', 
                    'count': {
                      '$count': {}
                    }, 
                    'totalrating': {
                      '$sum': '$rating'
                    }
                  }
                }, {
                  '$project': {
                    '_id': 0, 
                    'avg': {
                      '$divide': [
                        '$totalrating', '$count'
                      ]
                    }
                  }
                }
              ], 
              'as': 'review'
            }
          }, {
            '$unwind': {
              'path': '$review', 
              'includeArrayIndex': 'string', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$project': {
              '_id': 0, 
              'propertyCount': {
                '$size': '$Property'
              }, 
              'totalprice': '$booking.total', 
              'avgrating': '$review.avg'
            }
          }, {
            '$addFields': {
              'cprCount': 10, 
              'tprice': 100000, 
              'avgr': 4.5
            }
          }, {
            '$project': {
              'eligible': {
                '$switch': {
                  'branches': [
                    {
                      'case': {
                        '$and': [
                          {
                            '$gte': [
                              '$propertyCount', '$cprCount'
                            ]
                          }, {
                            '$gte': [
                              '$totalprice', '$tprice'
                            ]
                          }, {
                            '$gte': [
                              '$avgrating', '$avgr'
                            ]
                          }
                        ]
                      }, 
                      'then': true
                    }
                  ], 
                  'default': false
                }
              }
            }
          }
        ]
      )

      const a= Object.assign({},...criteria)

      if(a.eligible==true){
        console.log(a,'data')
        var superhost = await userModel.findOneAndUpdate({
          _id: user._id
        }, {
          $set: {
            superHost: true
          }
        }, {
          new: true
        });
        let response = commonfunction.checkRes(superhost);
        response.message = "You are now a SuperHost";
        res.status(200).send(response);
        logger.info(
          `url:${req.url},method:${req.method},host:${
            req.hostname
          },status:${JSON.stringify(response.status)}`
        );
      }else{

        var criterias = {
          Rating : "Greater than 4.5",
          Price : "Greater than 20000",
          Property : "Greater than 20"
        }
        res.status(201).send({status:false,code:201, message : "You are not eligible to become a superhost Please meet the criteria",criterias});
        console.log(a,'not')
      }
    }
    catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

  },

  // Get Favorite Property

  favoritePropertyList: async (req, res) => {
    var body = req.body;
    // var ObjectId = require('mongoose').Types.ObjectId;
    try {
      var favorite = await favoriteModel.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(body.userId),
          },
        },
        {
          $lookup: {
            from: "addProperty",
            let: {
              id: "$propertyId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$id"],
                  },
                },
              },
            ],
            as: "property",
          },
        },
        {
          $unwind: {
            path: "$property",
            includeArrayIndex: "1",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            "property._id": -1,
          },
        },
        {
          $project: {
            _id: 0,
            Fullname: "$property.add_title",
            Type: {
              // $cond: {
              //   if: {
              //     $eq: ["$events.private_Event", true],
              //   },
              //   then: "Private",
              //   else: "Public",
              // },
            },
            propertyId: "$property._id",
            Information: "$property.information",
            "Additional Information": "$property.additional_information",
            "Water Type": "$events.water_type",
            "Types of Fishes": "$events.fish_types",
            Facilities: "$events.amenities",
            Availibiity: "$events.availability",
            City: "$events.city",
            Address: "$events.address",
            Location: "$events.location",
            "Created At": "$events.createdAt",
            "Updated At": "$events.updatedAt",
          },
        },
        {
          $limit: 10,
        },
        {
          $skip: 0 * 5,
        },
      ]);
      console.log(favorite, "favorite");
      if (!favorite) {
        var message = "No Event Found";
        res.status(201).send({ status: false, code: 201, message: message });
      } else {
        let response = commonfunction.checkRes(favorite);
        response.message = "Favorite Event List";
        res.status(200).send(response);
        logger.info(
          `url:${req.url},method:${req.method},host:${
            req.hostname
          },status:${JSON.stringify(response.status)}`
        );
      }
    } catch (e) {
      logger.error(e);
      res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Delete Property

  deleteProperty: async (req, res) => {
    var body = req.body;
    try {
      var property = await propertyModel.findOne({ _id: body.propertyId });
    } catch (e) {
      logger.error(e);
      res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
    try {
      var deleteProperty = await propertyModel.findByIdAndRemove({
        _id: body.propertyId,
      });
      let response = commonfunction.checkRes(deleteProperty);
      response.message = "Deleted the Property";
      res.status(200).send(response);
      logger.info(
        `url:${req.url},method:${req.method},host:${
          req.hostname
        },status:${JSON.stringify(response.status)}`
      );
    } catch (e) {
      logger.error(e);
      res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Add Event

  addEvent: async (req, res) => {
    try {
      var user = await userModel.findOne({
        accessToken: req.headers["x-token"],
      });

      console.log(user, "Hello I am the userrr");
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }

    var body = req.body;

    try {
      var file = req.files;
      var longitude = parseFloat(body.longitude);
      var latitude = parseFloat(body.latitude);
      var img = [];
      for (const obj of file) {
        var i = `uploads/${obj.filename}`;
        img.push(i);
      }

      var data = {
        userId: user._id,
        // eventId : new mongoose.Types.ObjectId(),
        event_name: body.event_name,
        event_description: body.event_description,
        event_location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        event_Picture: img,
        event_date: body.event_date,
        event_time: body.event_time,
        event_Adress: body.event_Adress,
        event_price: body.event_price,
      };
      console.log(data, "Hello I am the data");
      var event = new eventModel(data);
      var save_event = await event.save();
      var response = commonfunction.checkRes(save_event);
      res
        .status(200)
        .send({
          status: true,
          code: 200,
          response,
          message: "Event Added Succesfully",
        });
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Update Event

  updateEvent: async (req, res) => {
    var body = req.body;
    var eventId = req.params.id;
    try {
      var event = await eventModel.findById(eventId);
      if (event) {
        var message = "Event Already Found";
        res.status(201).send({ status: false, code: 201, message: message });
      }
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
    try {

      var data = {
        // eventId : body.eventId,
        event_name: body.event_name,
        event_description: body.event_description,
      };
      console.log(data, "Hello I am the data");
      var update_event = await eventModel.findOneAndUpdate(data);
      // var update = update_event.save();
      var response = commonfunction.checkRes(update_event);
      res.status(200).send({status: true,code: 200,response,message: "Event Updated Succesfully"});
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

//  Book Property

bookProperty : async (req,res) => {
  var body = req.body;

    try {

      
    }
    catch (e) {
      logger.error(e);
      return res.status(201).send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
     try {

      var propertyPrice = await propertyModel.findOne({_id: body.propertyId});
      console.log(propertyPrice.price, "Hello I am the propertyPrice");

      }
      catch (e) {
        logger.error(e);
         res.status(201).send({ status: false, code: 201, message: message.ANNONYMOUS });
      }
      try {
        var dates = await bookingModel.findOne({_id: body.bookingId});
        console.log(dates.select_dates, "Hello I am the dates");

      }
      catch (e) {
        logger.error(e);
        res.status(201).send({ status: false, code: 201, message: message.ANNONYMOUS });
      }

  try {
    var user = await confirmedBookingModel.findOne({_id : body.userId});

    if(user){
      var message = "Payment Already Done";
      res.status(201).send({ status: false, code: 201, message: message });
    }
    else {

      try {
        var bookProperty = {
          userId: body.userId,
          propertyId: body.propertyId,
          price: propertyPrice.price,
          select_dates: dates.select_dates,
          
          

        }
        var booking = new confirmedBookingModel(bookProperty);
        var save_booking = await booking.save();
        const bookedData = await bookingModel.findOneAndUpdate({
          _id: body.propertyId,
         } , {status : "3"});
        
        var response = commonfunction.checkRes(save_booking);
        res.status(200).send({status: true,code: 200,response,message: "Booking Done Succesfully"});
      }
      catch (e) {
        logger.error(e);
        return res
          .status(201)
          .send({ status: false, code: 201, message: message.ANNONYMOUS });
      }

    }

  }
  catch {
    logger.error(e);
    return res
      .status(201)
      .send({ status: false, code: 201, message: message.ANNONYMOUS });
  }

},

  // Book Event

  bookEvent: async (req, res) => {
    var body = req.body;
    try {
      var user = await userModel.findOne({
        accessToken: req.headers["x-token"],
      });
      console.log(user, "Hello I am the userrr");
      if (!user) {
        var message = "User Not Found";
        res.status(201).send({ status: false, code: 201, message: message });
      } else {
        var event = await eventModel.findOne({ _id: body.eventId });
        if (!event) {
          var message = "Event Not Found";
          res.status(201).send({ status: false, code: 201, message: message });
        } else {
          var data = {
            userId: user._id,
            eventId: body.eventId,
            status : "1",
          };

          var book_event = new bookEventModel(data);
          var save_book_event = await book_event.save();
          var response = commonfunction.checkRes(save_book_event);
          res.status(200).send({status: true,code: 200,response,message: "Event Booked Succesfully"});
        }
      }
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  // Co-Host Property

  coHostProperty: async (req, res) => {
    var body = req.body;
    var propertyId = req.params.id;
    try {
      var property = await coHostModel.findById(propertyId);
      if (property) {
        var message = "Property Already Found";
        res.status(201).send({ status: false, code: 201, message: message });
      }
    } catch (e) {
      logger.error(e);
      return res.status(201).send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
    try {
      var data = {
        userId: body.userId,
        propertyId: body.propertyId,
      };

      var cohosted = new coHostModel(data);
      var save_cohosted = await cohosted.save();
      var response = commonfunction.checkRes(save_cohosted);
      res.status(200).send({status: true,code: 200,response,message: "Property Added Succesfully"});
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  //  Send Request

  sendRequest:async(req,res)=>{
    var body={
      propertyId:req.body.propertyId,
      accessToken:req.headers['x-token'],
      // select_dates: {
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        adults : req.body.adults,
        childrens : req.body.childrens,
        infants : req.body.infants,
        no_of_room_required : req.body.no_of_room_required,
      // },
    }
    console.log(body,"XXXXXXXXXXXXXXXXX");
    //Fetching User Details 
    try {
      var user= await userModel.findOne({accessToken:body.accessToken})
    } catch (e) {
      logger.error(e);
      return res.status(201).send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
    try {
      var existRequest= await bookingModel.aggregate([
        {
         "$match":{
           "propertyId":lib.mongoose.Types.ObjectId(body.propertyId),
           "userId":lib.mongoose.Types.ObjectId(user._id),
           "status":"0"
         }
        }
     ]) 
     } catch (e) {
       logger.error(e);
       return res.status(201).send({ status: false, code: 201, message: message.ANNONYMOUS });
     }

     if(existRequest.length>0){
     return res.status(200).send({status:true,code:200,message:"One request is already exist"});
     }else{
      var newRequest=new bookingModel({
        propertyId:body.propertyId,
        select_dates: {
          start_date: body.start_date,
          end_date: body.end_date,
        },
        no_of_guests: {
          adults : body.adults,
          childrens : body.childrens,
          infants : body.infants,
        },
        no_of_room_required : body.no_of_room_required,
        userId:user._id
      })
      console.log(newRequest,"newRequesXXXXXXXXXXXXXXXXXXXXXXXXXXXXXt");
      var saveDoc=newRequest.save()
      let response = commonfunction.checkRes({requestId:newRequest._id});
      response.message="Request submitted successfully"
      logger.info(`url:${req.url},method:${req.method},host:${req.hostname},status:${JSON.stringify(response.status)}`);
      return res.status(200).send(response);
     }
  },
  // Accept Request

  acceptOrDecline:async(req,res)=>{
    var body=req.body
    try {
      var exist = await bookingModel.aggregate([{
        "$match":{
          "_id":lib.mongoose.Types.ObjectId(body.requestId),
          "status":body.status
        }
      }])

      var user=await userModel.findOne({accessToken:req.headers["x-token"]})
      var event=await bookingModel.aggregate([
        {
          '$match': {
            '_id': new mongoose.Types.ObjectId(body.requestId), 
            'status': {"$ne" : req.body.status}
          }
        }, {
          '$lookup': {
            'from': 'addproperties', 
            'localField': 'propertyId', 
            'foreignField': '_id', 
            'as': 'property'
          }
        }, {
          '$unwind': {
            'path': '$property', 
            'includeArrayIndex': 'string', 
            'preserveNullAndEmptyArrays': true
          }
        }
      ])
      var events = Object.assign({}, ...event);

    } catch (e) {
      logger.error(e);
      return res.status(201).send({status:false,code:201,message:message.ANNONYMOUS});
    }
    try {
      const eLength=Object.keys(events).length

      if(eLength>0){
        if(user._id.toString()==events.property.userId.toString()){
          if(exist.length>0){
            if(exist[0].status=="1"){
            return res.status(200).send({status:true,code:200,message:"payment is pending"})
          }else{
            return res.status(200).send({status:true,code:200,message:"Something went wrong"})
          }
          } else {
            var currentTime= moment().valueOf()
            var dueDate=moment(currentTime).add(24,'hours')
            var data={
              status:body.status,
              acceptedAt:currentTime,
              dueDate:dueDate
            }
    
            var updateRequest = await bookingModel.findOneAndUpdate({_id:body.requestId},data);
            if(body.status=="1"){
              return res.status(200).send({status:true,code:200,paymentId:updateRequest._id,message:"Request Accepted but Payment is Pending"})
            }
            if(body.status=="2"){
              return res.status(201).send({status:false,code:201,message:"Request declined"})
            }
          }
        }else{
          return res.status(201).send({status:false,code:201,message:message.ANNONYMOUS});
        }
      }else{
        return res.status(201).send({status:false,code:201,message:message.ANNONYMOUS});
      }
     
    
    } catch (e) {
      logger.error(e);
      return res.status(201).send({status:false,code:201,message:message.ANNONYMOUS});
    }

  },

  

// Report User

reportTheUser:async(req,res)=>{
  var body=req.body

  try {
    var reportingUser=await reportModel.findOne({userId:body.reportinId})
  } catch (e) {
    logger.error(e);
    res.status(201).send({status:false ,code:201,message:message.ANNONYMOUS})
  }


  try {
    var currentUser=await reportModel.findOne({userId:body.userId})
  } catch (e) {
    logger.error(e);
    res.status(201).send({status:false ,code:201,message:message.ANNONYMOUS})
  }

  console.log(body, "YYYYYYYYYYYYYYYYYYYYYYY")

  try {
    if(reportingUser){
      console.log("here.....")
      var previouslyReportedBy=await reportModel.aggregate([
        {
          "$match":{
            userId:mongoose.Types.ObjectId(body.reportinId),
            reportedBy:{"$elemMatch":{reportedBy_id:mongoose.Types.ObjectId(body.userId)}}
          }
        }
      ])
      console.log("lenghtheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",previouslyReportedBy.length)
      if(previouslyReportedBy.length==0){
        var reportedBy={
          reportedBy_id:body.userId,
          reportedText:body.reportedText
        }
      var updateReportingId=await reportModel.findOneAndUpdate({_id:reportingUser._id},{$push:{reportedBy:reportedBy}})
      console.log(updateReportingId,"dasdasfgz.kfG>L?LGZISB")
    }   
    }else{
      var data={
        userId:body.reportinId,
        reportedBy:[
          {
            reportedBy_id:body.userId,
            reportedText:body.reportedText
          }
        ],
        reportedTo:[]
      }
      var addReporting=new reportModel(data)
      addReporting.save()
    }
    if(currentUser){
      console.log("hereee is ittttt")
      var previousUser=await reportModel.aggregate([
        {
          "$match":{
            userId:mongoose.Types.ObjectId(currentUser.userId),
            reportedTo:{"$elemMatch":{reported_id:mongoose.Types.ObjectId(body.reportinId)}}
          }
        }
      ]);
      if(previousUser.length>0){
        return res.status(200).send({status:true ,code:201,message:"All ready reported"})
      }else if(previousUser.length==0){
        
        var data={
          reported_id:body.reportinId,
          reportedText:body.reportedText
        }
        console.log("here we are",data)
        var updateCurrentUser=await reportModel.findOneAndUpdate({_id:currentUser._id},{$push:{reportedTo:data}})  
      }
    } else{
      var data={
        userId:body.userId,
        reportedTo:[
          {
            reported_id:body.reportinId,
            reportedText:body.reportedText
          }
        ],
        reportedBy:[]
      }
        var newEntry=new reportModel(data)
        newEntry.save();
    }
    res.status(200).send({status:true ,code:201,message:"Reported successfully"})
  } catch (e) {
    logger.error(e);
    res.status(201).send({status:false ,code:201,message:message.ANNONYMOUS})
  }
}


// Fetch Home Page





};
