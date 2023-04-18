const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./user.model");

exports.register = async (req, res, next) => {
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
  console.log("in login api");
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
            console.log("not matched");
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

//plain text password

// exports.register = async (req, res, next) => {
//     try {
//         // const { email, password } = req.body;
//         // // Check if email and password are valid
//         // if (!email || !password) {
//         //     return res.status(400).json({ error: 'Email and password are required' });
//         // }

//         // Check if user with given email already exists
//         const existingUser = await User.findOne({ email: req.body.email });
//         if (existingUser) {
//             return res.status(400).json({ errorMessage: 'User with that email already exists' });
//         }

//          // Create new user
//         const newUser = new User({
//             _id: new mongoose.Types.ObjectId(),
//             email: req.body.email,
//             pass: req.body.password
//           });
//         const savedUser = await newUser.save();

//         res.status(201).json(savedUser);
//       } catch (error) {
//         res.status(400).json({ error: error.message });
//       }
//     };

// exports.login = (req, res, next) => {

//     const { email, password } = req.body;
//     User.findOne({ email })
//     .then(user => {
//       if (!user) {
//         console.log('authentication failed');
//         return res.status(401).json({ message: 'Authentication failed' });
//       }
//       //if (!user.password || user.password.localeCompare(password) !== 0) {
//       if (user.pass !== password) {
//         console.log(user.pass);
//         console.log(pass);
//         console.log(email, password);

//         return res.status(401).json({ message: 'Authentication failed' });
//       }

//       return res.status(200).json({ message: 'Login successful' });
//     })
//     .catch(error => {
//       console.log(error);
//       res.status(500).json({ error });
//     });

// };

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
