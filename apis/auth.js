const express = require("express");
const router = express.Router();
const UserController = require('C:/Users/COMPUTER/Documents/IMS/IMS-Backend/apis/user/user.controller.js');

router.post("/register", UserController.register);

router.post('/login',UserController.login);

router.post('/reset',UserController.reset);

router.post('/reset/:id',UserController.changePassword);

module.exports = router;