const express = require('express')
const app = express()
const port = 3000

//setup env settings
require('dotenv').config();

//db
require('./server');

//
app.get('/', (req, res) => {
  res.send('Hello World!')
})






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

console.log("index");