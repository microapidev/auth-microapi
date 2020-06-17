require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const authRoute = require('./routes/auth');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
    res.json({
        massage: "Wellcome Micro-api-auth"
    })
});

app.listen(PORT, () => console.log(`App started @${PORT}`))