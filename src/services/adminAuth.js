const mongoose = require("mongoose");
const Admin = require("../models/admin");
const Settings = require("../models/settings");
const { CustomError } = require("../utils/CustomError");
const RandomString = require("randomstring");
const { sendForgotPasswordMail } = require("../EmailFactory/index");

class AdminService {
  async register(body) {
    // Adds a new admin to Auth-MicroApi DB
    let user = await Admin.findOne({ email: body.email });
    if (user) {
      throw new CustomError("Email address already in use", 403);
    }
    // const myDB = mongoose.connection.useDb();

    // const UserInfo = myDB.model('userInfo', userInfoSchema);

    let settings = new Settings();
    settings = await settings.save();

    user = new Admin({ ...body, settings: settings._id });
    user = await user.save();

    // DON'T DELETE: Admin acc. verification
    // Send a confirmation link to email
    // const mailStatus = await createVerificationLink(user, request);
    // console.log('===MailStatus===');
    // console.log(mailStatus);
    let data = user.toJSON();

    return data;
  }

  async getKey(body) {
    // New API KEY for admin
    let user = await Admin.findOne({ email: body.email });

    if (!user) {
      throw new CustomError("Authentication failed, email not found", 401);
    }

    if (!user.matchPasswords(body.password)) {
      throw new CustomError(
        "Authentication failed, password is incorrect",
        401
      );
    }

    let message =
      "API_KEY should be set in authorization header as - Bearer <token> - for subsequent user requests";
    let data = { API_KEY: user.generateAPIKEY() };

    return {
      data: data,
      message: message,
    };
  }

  async getSettings(body) {
    // New API KEY for admin
    let user = await Admin.findOne({
      email: body.email,
    }).populate("settings");

    if (!user) {
      throw new CustomError("Admin with email not found", 404);
    }

    const data = user.settings;
    const message = "Settings retrieved successfully";

    return {
      data: data,
      message: message,
    };
  }

  async updateSettings(body) {
    // New API KEY for admin
    let user = await Admin.findOne({ email: body.email });

    if (!user) {
      throw new CustomError("Admin with email not found", 404);
    }

    let settings = await Settings.findById(user.settings);

    if (!settings) {
      throw new CustomError("Settings not found or deleted", 404);
    }

    // Update settings with the providers provided in the request body.
    const {
      facebookAuthProvider,
      twitterAuthProvider,
      githubAuthProvider,
      googleAuthProvider,
    } = body;

    await Settings.findByIdAndUpdate(settings.id, {
      $set: {
        facebookAuthProvider,
        twitterAuthProvider,
        githubAuthProvider,
        googleAuthProvider,
      },
    });

    const data = settings;
    const message = "Settings updated successfully";

    return {
      data: data,
      message: message,
    };
  }

  async forgotPassword(req) {
    const { email } = req.body;
    // const buffer = crypto.randomBytes(32);
    // const token = buffer.toString();
    const token = RandomString.generate(64);
    const expirationTime = Date.now() + 3600000; // 1 hour
    const admin = await Admin.findOneAndUpdate(
      {
        email,
      },
      {
        resetPasswordToken: token,
        resetPasswordExpire: expirationTime,
      },
      {
        new: true,
      }
    );

    if (!admin) {
      throw new CustomError(
        `Sorry an Account with Email: ${email} doesn't exist on this service`,
        404
      );
    }

    const resetUrl = `http:\/\/${req.headers.host}\/api\/auth\/admin\/reset-password\/${token}`;
    sendForgotPasswordMail(admin.email, admin.username, resetUrl);

    return {
      url: resetUrl,
      email: admin.email,
    };
  } // end forgotPassword

  async resetPassword(req) {
    const { token } = req.params;
    const { password } = req.body;
    const admin = await Admin.findOneAndUpdate(
      {
        resetPasswordToken: token,
        resetPasswordExpire: {
          $gt: Date.now(),
        },
      },
      {
        password,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
      {
        new: true,
      }
    );
    if (!admin) {
      throw new CustomError(
        "Password reset token is invalid or has expired.",
        422
      );
    }

    return {
      status: "success",
    };
  } // end resetPassword

  async deactivateUser(req) {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        status: "fail",
        code: 400,
        message: "Invalid user id",
      };
    }

    try {
      const result = await User.updateOne(
        { _id: userId },
        { $set: { active: 0 } }
      );
      if (!result) {
        return {
          status: "fail",
          code: 400,
          message: "User not found.",
        };
      }
      return {
        status: "success",
        code: 200,
        message: "User deactivated",
      };
    } catch (err) {
      return {
        status: "error",
        code: 500,
        message: "Something went wrong.",
      };
    }
  }
}

module.exports = new AdminService();
