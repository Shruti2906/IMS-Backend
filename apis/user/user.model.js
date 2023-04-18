const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
    },
    pass: { type: String, required: true },
});

// Schema.methods.comparePassword = function (password, callback) {
//     bcrypt.compare(password, this.password, (error, isMatch) => {
//       if (error) {
//         return callback(error);
//       }
//       callback(null, isMatch);
//     });
//   };
  

module.exports = mongoose.model('User', Schema);