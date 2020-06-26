require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

const authRoute = require('./routes/auth');
const { connectDB } = require('./controllers/db')
const { errorHandler } = require('./utils/error')
const openApiDocumentation = require("./swagger/openApiDocumentation");
const swaggerUi = require("swagger-ui-express");
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
app.use("/", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));


app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(errorHandler)

app.listen(PORT, () => console.log(`App started @${PORT}`))
