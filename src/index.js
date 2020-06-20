require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const authRoute = require('./routes/auth');
const registerRoute= require('./routes/register');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api/auth', authRoute);

app.use('/api/register', registerRoute);

app.get('/', (req, res) => {
    res.json({
        massage: "Wellcome micro-auth-api"
    })
});


// app.use((req, res, next) => {
//     let err = new Error("Not Found");
//     err.status = 404;
//     next(err);
// });
console.log(process.env.DB_URL)

app.listen(PORT, () => console.log(`App started @${PORT}`))