const mongoose = require("mongoose");
const User = require("./user.model");

exports.register = (req, res, next) => {
    // complete code
    return res.status(201).json({
        message: "User created",
    });
};

exports.login = (req, res, next) => {
    // complete code
    return res.status(200).json({
        message: "Login successfull",
    });
};

exports.reset = (req, res, next) => {
    // complete code
    res.status(201).json({
        res: 'Email Sent'
    });
}

exports.changePassword = async (req, res, next) => {
    // todo
    res.status(500).json({
        message: 'Changed successfully'
    });
};