const userRouter = require("express").Router();
const {
  registerValidation,
  loginValidation,
} = require("../utils/validation/joiValidation");
const { authorizeUser } = require("../middlewares/middleware");
const UserController = require("../controllers/auth");
const EmailVerificationModel = require("../models/EmailVerification");
const {
  forgotValidation,
  resetPasswordValidation,
  changePasswordValidation,
} = require("../utils/validation/joiValidation");
const SessionMgt = require("../services/SessionManagement");

module.exports = () => {
  // userRouter.get('/active', auth, (req, res) => {
  //   res.status(200).json({
  //     _id: req.user.id,
  //     isAdmin: req.user.isEmailVerified,
  //     isAuth: true,
  //     email: req.user.email,
  //     username: req.user.username,
  //   });
  // });

  userRouter
    .route("/active")
    // .get(SessionMgt.checkSession, (request, response) => {
    //   response.redirect('/');
    // })
    .get(UserController.activeUser);

  userRouter
    .route("/enable2fa")
    // .get(SessionMgt.checkSession, (request, response) => {
    //   response.redirect('/');
    // })
    .get(UserController.enable2FA);

  userRouter
    .route("/register")
    .get(authorizeUser, SessionMgt.checkSession, (request, response) => {
      response.status(200).json({
        success: true,
      });
    })
    .post(authorizeUser, registerValidation(), UserController.register);

  userRouter
    .route("/login")
    .get(SessionMgt.checkSession, (request, response) => {
      response.status(200).json({
        success: true,
      });
    })
    .post(loginValidation(), UserController.login);

  userRouter
    .route("/verify")
    // .get(SessionMgt.checkSession, (request, response) => {
    //   response.redirect('/');
    // })
    .get(UserController.otpVerify);

  userRouter.get("/logout", async (request, response) => {
    response.clearCookie("user_sid", { path: "/" });

    SessionMgt.logout(request);

    // response.redirect('/');
    response.status(200).json({
      success: true,
      message: "Redirect user to login at GET: /api/user/login",
    });
  });

  userRouter.post("/reset", forgotValidation(), UserController.forgotPassword);

  userRouter.get("/:token", (request, response, next) => {
    EmailVerificationModel.findOne({
      token: request.params.token,
    }).then((doc) => {
      response.redirect(
        `${decodeURIComponent(doc.emailVerifyCallbackUrl)}?passwordResetToken=${
          doc.token
        }`
      );
    });
  });

  userRouter.patch(
    "/:token",
    authorizeUser,
    resetPasswordValidation(),
    UserController.resetPassword
  );
  userRouter.post(
    "/change-password",
    authorizeUser,
    changePasswordValidation(),
    UserController.changePassword
  );

  return userRouter;
};
