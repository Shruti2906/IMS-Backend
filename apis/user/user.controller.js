const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("./user.model");
const Enquiry = require("./enquiry.model");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

//JWT_SECRET will be common secret
const JWT_SECRET = process.env.JWT_SECRET;

function sendRegistrationEmail(toEmail) {
  let transporter = nodemailer.createTransport({
    service: MAIL_HOST,
    port: 587,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });
  const mailOptions = {
    from: MAIL_USER,
    to: toEmail,
    subject: "Welcome to LINKCODE IMS",
    html: `<p>Hello,</p>
             <b>You are successfully registered with our application.!</b>
            `,
  };
  //  <a href="${activationLink}">${activationLink}</a>
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

function sendPasswordResetEmail(toEmail, token) {
  console.log(toEmail);
  let transporter = nodemailer.createTransport({
    service: MAIL_HOST,
    port: 587,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });
  const mailOptions = {
    from: MAIL_USER,
    to: toEmail,
    subject: "Password Reset Request",
    html: `<p>Hello,</p>
    <p>You have requested to reset your password for your LINKCODE IMS account.</p>
    <p>Please <a href="${`https://localhost:3000/apis/users/resetPassword?token=${token}`}">reset your password</a> here</p>
    <br>
    <p>If you did not request a password reset, please ignore this email.</p>
            `,
  };
  //  <a href="${activationLink}">${activationLink}</a>
  // <p>Please <a href="${`https://ims-frontend-kappa.vercel.app/auth/resetPassword/reset-password?token=${token}`}">reset your password</a> here</p>

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

exports.register = async (req, res, next) => {
  //validation rules using express-validator
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  await body("email").custom(isEmailValid).run(req);

  await body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .run(req);
  
  // Check for validation errors and return 400 response if there are any
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user with given email already exists
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ errorMessage: "User with that email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      pass: hash,
    });

    const savedUser = await newUser.save();

    sendRegistrationEmail(savedUser.email);

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = (req, res, next) => {
  
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        console.log("authentication failed");
        return res.status(401).json({ message: "Authentication failed" });
      }
      bcrypt
        .compare(password, user.pass)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).json({ message: "Authentication failed, password didn't match" });
          }

          const token = jwt.sign(
            {
              _id: user._id,
              email: user.email,
              type: user.type,
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } 
          );
          console.log('token : ', token);
          return res.status(200).json({ message: "Login successful",token: token });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email;

  try {
    //check if user exist in our db
    const UserData = await User.findOne({ email });

    if (!UserData) {
      console.log("!UserData: ", UserData);
      return res.status(404).json({ error: "User not found" });
    }

    //user exist and now create one time password link that is vallid for 15 minutes

    //this secret will be unique for each user
    const secret = JWT_SECRET + UserData.pass;
    const payload = {
      email: UserData.email,
      id: UserData.id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });

    const data = await User.updateOne(
      { email: email },
      { $set: { token: token } }
    );

    //Send Mail with password reset link
    sendPasswordResetEmail(UserData.email, token);
    res
      .status(200)
      .json({ success: true, msg: "Password reset link sent to your email." });
  } catch (error) {
    res.status(200).json({ success: false, msg: error.message });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const token = req.query.token; //const token = req.body.token;
    const password = req.body.password;
    const tokenData = await User.findOne({ token: token });

    if (!tokenData) {
      return res
        .status(200)
        .send({ success: true, message: "This Link is Expired.!" });
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    const updatedUSer = await User.findByIdAndUpdate(
      { _id: tokenData._id },
      { $set: { pass: newPassword, token: "" } },
      { new: true }
    );

    console.log("\nupdatesUser: ", updatedUSer._id);
    console.log("\nupdatesUser: ", updatedUSer.email);
    console.log("\nupdatesUser: ", updatedUSer.pass);
    res
      .status(200)
      .send({
        success: true,
        message: "User Password has been Reset",
        data: updatedUSer,
      });
  } catch (error) {
    res.status(401).send({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res, next) => {
  // todo

  res.status(500).json({
    message: "Changed successfully",
  });
};

// Create an enquiry
exports.addEnquiry = async (req, res, next) => {
  console.log('add eq ');
  try {
    const { firstname, lastname,  email, mobno, message } = req.body;
    console.log('req body : ',req.body);

    const enquiry = new Enquiry({ firstname, lastname, email, mobno, contactMessage:message });
    await enquiry.save();
    res.status(201).json({ message: 'Enquiry added successfully' });
  } catch (error) {
    console.error('Error on Enquiry:', error);
    res.status(500).json({ error: 'An error occurred while processing your inquiry' });
  }
};

