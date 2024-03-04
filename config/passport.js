const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();

module.exports = function (passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: 'http://localhost:3000/auth/google/callback',
			},
			function (accessToken, refreshToken, profile, done) {
				//  find user google

				User.findOne({ googleId: profile.id }).then((currentUser) => {
					if (currentUser) {
						console.log('user existed: ' + currentUser);
						done(null, currentUser);
					} else {
						//create new
						new User({
							username: profile.emails[0].value,
							name: profile.displayName,
							googleId: profile.id,
						})
							.save()
							.then((newUser) => {
								console.log(
									'new user created via google: ' + newUser
								);
								done(null, newUser);
							});
					}
				});
			}
		)
	);
	passport.use(
		new LocalStrategy(
			{ usernameField: 'username' },
			(username, password, done) => {
				User.findOne({ username: username })
					.then((user) => {
						if (!user) {
							return done(null, false, {
								message: 'This username is not registed',
							});
						}
						bcrypt.compare(
							password,
							user.password,
							(err, isMatch) => {
								if (err) throw err;
								if (isMatch) {
									return done(null, user);
								} else {
									return done(null, false, {
										message: 'Password is incorrect',
									});
								}
							}
						);
					})
					.catch((err) => console.log(err));
			}
		)
	);
	passport.serializeUser(function (user, done) {
		process.nextTick(function () {
			return done(null, user.id);
		});
	});

	passport.deserializeUser(function (id, done) {
		process.nextTick(function () {
			User.findById(id).then((user) => {
				return done(null, user);
			})
			
		});
	});
};
