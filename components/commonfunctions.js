var libConf = require('../index');
var logger = require('../config/logger');
var multer= require('../index').multer;
module.exports={
    checkRes:(data)=>{
        const obj={status:true,code:200};
        if(Array.isArray(data)){
            obj.data=data;
        }else{
            obj.results=data
        }
        return obj
    },
    // runMulter:()=>{
    // },
    customMessages:()=>{
        var messages={
            USER_EXIST:"user already exists",
            DATA_NOT_FOUND: 'Data Not Found',
            CREATION: 'Feed created successfully',
            ERROR: 'Error',
            UPDATE: 'Profile updated successfully',
            DELETE: 'Feed deleted successfully',
            VERIFIED: 'Your mobile number is Verified!',
            NOT_MATCHED: 'Password does not match',
            USER_NOT_FOUND: 'User not found',
            LOGIN: 'You have successfully logged in.',
            OTP_NOT_MATCHED: 'The OTP entered is incorrect.',
            VERFIED: 'Your mobile number is Verified!',
            ANNONYMOUS: 'Something Went Wrong, Please Try Again Later.',
            ERROR: 'Error',
            SESSION_ERROR: 'Session expired. please retry or login again to continue Union news App.',
            SESSION_ERROR_Admin:'Session expired. please retry or login again to continue Union news App admin panel.',
            BLOCKED_BY_ADMIN: `An administrator has blocked you from running this app. For more information please contact the “appinfo.profession@gmail.com” administrator.`,
            INVALID_PATH: 'Invalid path access',
            OTP_SENT_EMAIL: 'Otp sent on your registered email id ',
            OTP_SENT: 'Otp sent on your mobile ',
            FIELD_ERR: 'is Required',
            PWD_CHANGE_ERR: 'Unable to change password',
            PWD_CHANGED: 'Password changed successfully',
            OLD_PWD: 'The old password you have entered is incorrect',
            PWD_INC: 'The password you have entered is incorrect',
            PWD_ON_EMAIL: 'Password sent on your registered email.',
            FETCH: 'Data fetched successfully',
            EMAIL_NOT_VERIFIED: 'A verification link has been sent to your email account. Please click on the link that has just been sent to your email account to verify your email and continue the registration process.',
            EMAIL_EXIST: 'Already exists an account registered with this email address.',
            PHONE_EXIST: 'Already exists an account registered with this phone number',
            PHONE_NOT_EXIST: 'Account does not exist with this mobile number',
            REGISTER: 'Congratulations, your account has been successfully created.',
            NEW_OTP: 'NEW OTP',
            INVALID_OTP: 'The OTP entered is incorrect.',
            EMAIL_NOT_EXIST: 'Account does not exist with this email',
            // EMAIL_EXIST: 'Invalid Email',
            ACOOUNT_BLOCKED: 'An administrator has blocked you from running this app. For more information please contact the “appinfo.profession@gmail.com” administrator',
            OLD_PASSWORD: 'The old password you have entered is incorrect.',
            FOLLOW:'Follow Succesfully',
            UNFOLLOW:'Unfollow Successfully',
            ENV:'This email is not verified'
        };
        return messages;
    },
   
}