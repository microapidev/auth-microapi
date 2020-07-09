const adminFunctionRouter = require('express').Router();
const {adminAuth} = require('../utils/middleware');
const adminController = require('../controllers/admin');

adminFunctionRouter.get('/',adminAuth);

adminFunctionRouter.patch('/deactivate/:userId',adminAuth,adminController.deactivateUser);
module.exports = adminFunctionRouter;