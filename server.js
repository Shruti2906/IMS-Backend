const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./apis/auth.js");
const uri = process.env.MONGODB_URI;

mongoose
  .connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

console.log("server");
