const express = require("express");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

const userRoutes = require("./apis/auth.js");

//setup env settings
require("dotenv").config();

//require db connection file
require("./server");

//
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//

app.use(express.json());
app.use("/apis/users", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

console.log("index");
