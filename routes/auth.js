var express = require('express');
const passport = require('passport');
const authRouter = express.Router();

authRouter
	.route('/')
	.get(passport.authenticate('google', { scope: ['email', 'profile'] }));

authRouter.route('/callback').get((req, res, next) => {
	passport.authenticate('google', {
		failureRedirect: '/users/login',
		successRedirect: '/',
	})(req, res, next);
});

module.exports = authRouter;
