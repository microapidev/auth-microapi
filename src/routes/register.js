const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secret = "serete";
const db = require("../config/db.config");

const User = db.user;