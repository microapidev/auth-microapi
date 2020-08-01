const router = require("express").Router();
const {
  registerValidation,
  loginValidation,
} = require("../utils/validation/joiValidation");
const { authorizeUser } = require("../middlewares/middleware");
const UserController = require("../controllers/auth");
const {
  forgotValidation,
  resetPasswordValidation,
} = require("../utils/validation/joiValidation");
const SessionMgt = require("../services/SessionManagement");
// .get(SessionMgt.checkSession, (request, response) => {
//   response.redirect('/');
// })

module.exports = () => {
  router.get("/active", UserController.activeUser);
  router.get("/enable2fa", UserController.enable2FA);

  router
    .route("/register")
    .get(authorizeUser, SessionMgt.checkSession, (request, response) => {
      response.status(200).json({
        success: true,
      });
    })
    .post(authorizeUser, registerValidation(), UserController.register);

  router
    .route("/login")
    .get(SessionMgt.checkSession, (request, response) => {
      response.status(200).json({
        success: true,
      });
    })
    .post(loginValidation(), UserController.login);

  router
    .route("/verify")
    // .get(SessionMgt.checkSession, (request, response) => {
    //   response.redirect('/');
    // })
    .get(UserController.otpVerify);

  router.get("/logout", async (request, response) => {
    response.clearCookie("user_sid", { path: "/" });

    SessionMgt.logout(request);

    // response.redirect('/');
    response.status(200).json({
      success: true,
      message: "Redirect user to login at GET: /api/user/login",
    });
  });

  router.post("/reset", forgotValidation(), UserController.forgotPassword);

  router.get("/:token", (request, response, next) => {
    response.redirect(
      `https://upbeat-leavitt-2a7b54.netlify.app/pages/forgot-new/?token=${request.params.token}`
    );
  });

  router.patch(
    "/:token",
    authorizeUser,
    resetPasswordValidation(),
    UserController.resetPassword
  );

  return router;
};
