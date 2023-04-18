const express = require('express')
const app = express()
const port = 3000

//const authRoutes = require("./apis/auth.js");
const userRoutes = require('./apis/auth.js');

//setup env settings
require('dotenv').config();

//db
require('./server');

//
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//

app.use(express.json());
app.use('/apis/users', userRoutes);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log("index");