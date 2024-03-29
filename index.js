const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

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
const courseRoutes = require("./apis/courses/courses.routes.js");

//setup env settings
require("dotenv").config();

//require db connection file
require("./server");

app.get("/health", (req, res, next) => {
  return res.status(200).json({
    message: "Health is good",
    date: new Date(),
  });
});

app.use(express.json());
app.use("/apis/users", userRoutes);
app.use("/apis/courses", courseRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

console.log("index");
