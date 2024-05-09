const express=require('express');
const router=express.Router();
const controller =require("../controller/index.js");
const singleImage = require('../middleware/file.upload.js'); // Import the multer middleware
const {notification}=require('../notification/notification.js')
const { verifyToken } = require('../middleware/auth.middleware');
// auth api

router.post('/signup',controller.authController.signup);
router.post('/login',controller.authController.login);
router.get('/getUserData/:id',controller.authController.getUserData);
router.post('/update-user-data/:id', controller.authController.updateUserData);

router.post('/logout',verifyToken,controller.authController.logout);
//CHAT API

router.post('/addMessage',controller.chatcontroller.storeMessage)
router.get('/getMessage',controller.chatcontroller.getMessage)
router.post('/updateMessage/:id',controller.chatcontroller.updateMessage)
router.post('/deleteMessage/:id',controller.chatcontroller.deleteMessage);
router.get("/getAllUserData",controller.authController.getAllUserData);
router.post('/storegroupmessage',controller.chatcontroller.storeGroupMessage)

//  group api
router.post('/createGroup',controller.chatcontroller.createGroup);
router.get('/getGroups/:id',controller.chatcontroller.getGroups);
router.get('/getGroupMessages/:id',controller.chatcontroller.getGroupMessage)
// video call
// router.get('/getVideoCallUser/:id',controller.videoCallController.getVideoCallUser);
// router.post('/storeVideoCallUserData',controller,controller.videoCallController.addVideoCallUser)
router.post('/submit-token',controller.chatcontroller.submitToken)
module.exports=router;