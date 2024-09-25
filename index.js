const express = require("express");
const dotenv = require("dotenv");
const Config = require("./config-interview");

dotenv.config();

const app = express();

app.listen(process.env.PORT || 4000, function (err) {
  if (err) throw err;
  console.log(`Server running at port ${process.env.PORT}`);
});
