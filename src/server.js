const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const connectDB = require("./controllers/index");
// routes
const auth = require("./routes/auth");

const app = express();
//bodyParser
app.use(express.json());
app.use(cookieParser());
//mounts
app.use("/api/v1/auth", auth);

connectDB();




app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});
