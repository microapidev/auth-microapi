const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");

// DB
const connectDB = require("./controllers/index");
// Security
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
// routes
const auth = require("./routes/auth");

const app = express();

// Set view engine
app.set("view engine", "ejs");
//bodyParser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Prevent NoSQL Injection
app.use(mongoSanitize());

// Set Security Headers
app.use(helmet());

// Prevent XSS
app.use(xss());

// Prevent Param Pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Limit Request
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10mins
    max: 100
});

app.use(limiter);
//mounts
app.use("/api/v1/auth", auth);

connectDB();


app.get("/", (req, res) => {
    res.render("index");
})

app.listen(process.env.PORT, () => {
    console.log("Server running on port 5000");
});