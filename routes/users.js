var express = require('express');
const userController = require('../controllers/UserController');

const userRouter = express.Router();

const { ensureAuthenticated } = require('../config/auth');

userRouter.route('/profile').get(ensureAuthenticated, userController.profile);
userRouter.route('/profile/edit').get(ensureAuthenticated, userController.edit).post(ensureAuthenticated, userController.handleEditProfile);
userRouter.route('/profile/change-password').get(ensureAuthenticated, userController.renderChangePassword).post(ensureAuthenticated, userController.changePassword)

userRouter
	.route('/register')
	.get(userController.signup)
	.post(userController.register);
userRouter
	.route('/login')
	.get(userController.login)
	.post(userController.signin);
userRouter.route('/logout').get(userController.signout);

module.exports = userRouter;
