const bcrypt = require('bcrypt');
const User = require('../model/user');
const passport = require('passport');


class UserController {
	login(req, res, next) {
		res.render('login');
	}
	profile(req, res, next) {
		res.render('profile/profile');
	}
	edit(req, res, next) {
		res.render('profile/edit');
	}
	handleEditProfile = async (req, res, next) => {
		const body = req.body;
		const { name, username, id, YOB } = body;
		let updatedUser = {}
		if(YOB){

			const now = new Date();
			let yearNow = now.getFullYear();
			if (YOB > yearNow) {
				req.flash('error_msg', 'Please enter a valid year of birth');
				res.redirect('back')
				return
			}

			updatedUser.YOB = YOB

		}
			
		await User.findOne({username: username}).then(result => {
			if(result && result.id !== id){
				req.flash('error_msg', 'Duplicated username!!')
				res.redirect('back')
				return
			}
		})
		updatedUser.username = username
		updatedUser.name = name
		const result = await User.findByIdAndUpdate(
			id,
			updatedUser,
			{ new: true }
		).then(res => res).catch(err => console.log(err))

		res.render('profile/edit', {
			user: result,
			success_msg: 'The profile is edited successfully'
		  })
	};

	renderChangePassword(req, res, next) {
		res.render('profile/change-password');
	}

	renderUserPage = async (req, res, next) => {

		const users = await User.find().then(res => res)

		res.render('admin/user', {
			users: users
		});
	}

	changePassword = async (req, res, next) => {
		const body = req.body;
		const { password, confirmPassword, id } = body;
		let errors = [];

		if(!password || !confirmPassword){
			errors.push({msg: 'Please enter all field!'})
		}
		if(confirmPassword !== password) {
			errors.push({msg: 'Passwords must be the same!'})
		}
		if(errors.length > 0){
			res.render('profile/change-password', {
				errors,
				confirmPassword,
				password,
			});
		}
		//Hash password
		bcrypt.hash(password, 10, async function (err, hash) {
			if (err) throw err;
			const hashedPassword = hash;
			const result = await User.findByIdAndUpdate(
				id,
				{ password: hashedPassword },
				{ new: true }
			).then(res => res).catch(err => console.log(err))
			console.log(result)
			res.render('profile/change-password', {
				user: result,
				success_msg: 'Password changed successfully'
			  })
		});

		
	};

	signup(req, res, next) {
		res.render('register');
	}
	signin(req, res, next) {
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/users/login',
			failureFlash: true,
		})(req, res, next);
	}
	signout(req, res, next) {
		req.logout(function (err) {
			if (err) {
				return next(err);
			}
			req.flash('success_msg', 'You are logged out');
			res.redirect('/users/login');
		});
	}
	register(req, res, next) {
		const { username, password, YOB, name } = req.body;
		let errors = [];
		if (!username || !password || !YOB || !name) {
			errors.push({ msg: 'Please enter all fields' });
		}
		if (password.length < 6) {
			errors.push({ msg: 'Password must be at least 6 characters' });
		}
		const now = new Date();
		let yearNow = now.getFullYear();
		if (YOB > yearNow) {
			errors.push({ msg: 'Please enter a valid year of birth' });
		}
		if (errors.length > 0) {
			res.render('register', {
				errors,
				username,
				password,
			});
		} else {
			User.findOne({ username: username }).then((user) => {
				if (user) {
					errors.push({ msg: 'Username already exists' });
					res.render('register', {
						errors,
						username,
						password,
					});
				} else {
					const newUser = new User({
						username,
						password,
						name,
						YOB,
					});
					//Hash password
					bcrypt.hash(newUser.password, 10, function (err, hash) {
						if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then((user) => {
								req.flash('success_msg', 'Register successfully')
								res.redirect('/users/login');
								return
							})
							.catch(next);
					});
				}
			});
		}
	}
}

module.exports = new UserController();
