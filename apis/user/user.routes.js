const express = require("express");
const router = express.Router();
const UserController = require('./user.controller');

router.post("/register", UserController.register);

router.post('/login',UserController.login);

router.post('/forgotPassword',UserController.forgotPassword);

router.post('/resetPassword',UserController.resetPassword);

router.post('/reset/:id',UserController.changePassword);

router.post('/addEnquiry',UserController.addEnquiry);


module.exports = router;