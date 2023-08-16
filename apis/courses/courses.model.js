const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Course", Schema);