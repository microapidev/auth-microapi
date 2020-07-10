const adminFunctionRouter = require('express').Router();
const adminAuth = require('../controllers/auth').authorizeUser;
const adminController = require('../controllers/admin');
const newUser = require("../controllers/userController");

adminFunctionRouter.patch('/deactivate/:userId',adminAuth,adminController.deactivateUser);

//get all active users within last 30 days
adminFunctionRouter.get('/activeusers',adminAuth,newUser.getActiveUsers);


//get all users that registerd in the last 30 last30DAys
adminFunctionRouter.get('/registerdusers',adminAuth,newUser.getNewlyRegisteredUsers);

module.exports = adminFunctionRouter;
