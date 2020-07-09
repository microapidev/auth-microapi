const adminFunctionRouter = require('express').Router();
const adminAuth = require('../controllers/auth').authorizeUser;
const adminController = require('../controllers/admin');


adminFunctionRouter.patch('/deactivate/:userId',adminAuth,adminController.deactivateUser);
module.exports = adminFunctionRouter;