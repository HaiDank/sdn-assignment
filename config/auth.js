module.exports = {
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash('error', 'Please log in!!');
		res.redirect('/users/login');
	},
	requireAdmin: function (req, res, next) {
		if(req.user.isAdmin) {
			return next()
		}
		req.flash('error', "You don't have permission");
		res.redirect('/');
	}
};
