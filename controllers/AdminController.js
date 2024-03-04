
class AdminController {
	index(req, res, next) {
		res.redirect('/admin/orchids')
	}

}

module.exports = new AdminController()