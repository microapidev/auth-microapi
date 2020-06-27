const mongoose = require('mongoose');
const User = require('./User.model');

const db = 'mongodb://localhost/auth-api';

mongoose.connect(db);