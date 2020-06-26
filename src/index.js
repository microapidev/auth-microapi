require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session')
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;

const authRoute = require('./routes/auth');
const { connectDB } = require('./controllers/db');
const { errorHandler } = require('./utils/error');

const app = express();
app.use(cookieParser())
connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
// initialize express-session to allow us track the logged-in user.
app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffsjl',
  resave: false,
  saveUninitialized: false,
}));


app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to micro-auth-api',
  });
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`App started @${PORT}`));
module.exports = app;