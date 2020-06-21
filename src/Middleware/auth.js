const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const errorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Implement route Protection and also get current User id
// Anytime a user makes a request to a protected route, the current user id (req.user.id) can then be run through the database to get the active user 
// The current user id will be used to get the credentials
// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // cookies 
    else if (req.cookies.token){
        token = req.cookies.token;
    }

    // Make Sure token exist 
    if (!token) {
        res.status(401).json({
            success: false
        });
    }

    // Verify token 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        res.status(401).json({
            success: false
        });
    };


});