require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;
const authRoute = require("./routes/auth");
const { connectDB } = require("./controllers/db");

const app = express();

connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to micro-auth-api",
  });
});

// app.use((req, res, next) => {
//     let err = new Error("Not Found");
//     err.status = 404;
//     next(err);
// });

app.listen(PORT, () => console.log(`App started @${PORT}`));
