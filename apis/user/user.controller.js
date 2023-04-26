const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("./user.model");

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
            return res.status(401).json({ message: "Authentication failed" });
          }
          return res.status(200).json({ message: "Login successful" });
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

exports.reset = (req, res, next) => {
  // complete code
  res.status(201).json({
    res: "Email Sent",
  });
};

exports.changePassword = async (req, res, next) => {
  // todo
  res.status(500).json({
    message: "Changed successfully",
  });
};
