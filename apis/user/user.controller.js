const mongoose = require("mongoose");
const User = require("./user.model");

exports.register = async (req, res, next) => {
   
    try {
        const { email, password } = req.body;
        // Check if email and password are valid
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user with given email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with that email already exists' });
        }
         // Create new user
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            pass: req.body.pass
          });
       

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };

exports.login = (req, res, next) => {
    
    const { email, pass } = req.body;
    User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      //if (!user.password || user.password.localeCompare(password) !== 0) {
      if (user.pass !== pass) {
        console.log(user.pass);
        console.log(pass);
        console.log(email, pass);

        return res.status(401).json({ message: 'Authentication failed' });
      }
      
      return res.status(200).json({ message: 'Login successful' });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
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