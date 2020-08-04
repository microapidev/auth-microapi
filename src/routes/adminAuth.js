const adminRouter = require("express").Router();
const { authorizeUser } = require("../middlewares/middleware");
const {
  registerValidation,
  loginValidation,
  updateSettingsValidation,
  forgotValidation,
  resetPasswordValidation,
} = require("../utils/validation/joiValidation");
const AdminCtrl = require("../controllers/admin");

module.exports = () => {
  adminRouter.post("/register", registerValidation(), AdminCtrl.register);
  adminRouter.post("/getkey", loginValidation(), AdminCtrl.getKey);
  adminRouter.post(
    "/reset-password",
    forgotValidation(),
    AdminCtrl.forgotPassword
  );
  adminRouter.get("/settings", authorizeUser, AdminCtrl.getSettings);
  adminRouter.patch(
    "/settings",
    authorizeUser,
    updateSettingsValidation(),
    AdminCtrl.updateSettings
  );
  adminRouter.get(
    "/settings-schema",
    authorizeUser,
    AdminCtrl.getSettingsSchema
  );
  /* I'll deal with this later */
  adminRouter.get("/reset-password/:token", (request, response, next) => {
    response
      .status(200)
      .send(
        "It's cool you're here 😁, but you should be using postman to send a PATCH request to change password via this url!"
      );
  });
  adminRouter.patch(
    "/reset-password/:token",
    resetPasswordValidation(),
    AdminCtrl.resetPassword
  );

  return adminRouter;
};
