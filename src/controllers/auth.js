const User = require('../models/User');
const asyncHandler = require("../middleware/async");
const ErrorResponse = require('../utils/errorResponse');

const {
    protect
} = require("../middleware/auth");

//@Desc register
//@route Post /api/v1/auth/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        password,
        role
    } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
});

//@Desc login
//@route Post /api/v1/auth/login
//@access Public

exports.login = asyncHandler(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    if (!email && !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }
    //FInd user in DB
    const user = await User.findOne({
        email: email
    }).select('+password');

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }
    //Compare Password
    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid Credentials", 401));
    }

    sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            token

        })

}

//@Desc getuser
//@route Post /api/v1/auth/getuser
//@access Private

exports.getUser = asyncHandler( async (req, res, next ) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

//@Desc logout
//@route GET /api/v1/auth/logout
//@access Private

exports.logOut = asyncHandler(async (req, res, next) => {
    res.cookie("token", "none",{
        expires: new Date(Date.now() + 10 * 100),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});