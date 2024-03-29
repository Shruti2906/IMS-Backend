const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["STUDENT", "INSTRUCTOR", "ADMIN", "SUPERADMIN"],
    default: "STUDENT",
  },
  token: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", Schema);
