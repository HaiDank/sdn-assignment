const CategoryModel = require('../model/category');
const OrchidModel = require('../model/orchid');

const validUrl = (url) => {
	try {
		new URL(url);
		return true;
	} catch (error) {
		return false;
	}
};

const createOrchid = async (req, res, next) => {
	let body = req.body;
	console.log('create request: ' + JSON.stringify(body));
	const name = body.name;
	const image = body.imageUrl;
	const origin = body.origin;
	const isNatural = body.isNatural === 'true' ? true : false;
	const categoryName = body.category;

	if (!name || !image || !origin || !categoryName) {
		req.flash('error_msg', 'Please enter all field!');
		res.redirect('/admin/orchids/create');
		return;
	}

	if (!validUrl(image)) {
		req.flash('error_msg', 'Please enter a valid image Url');
		res.redirect('/admin/orchids/create');
		return;
	}

	await OrchidModel.findOne({ name: name }).then(async (orchid) => {
		if (orchid) {
			req.flash('error_msg', 'Duplicated name!');
			res.redirect('/admin/orchids/create');
			return;
		}
	});

	const catResult = await CategoryModel.findOne({ name: categoryName }).then(
		(category) => category
	);
	console.log(catResult);
	if (!catResult) {
		req.flash('error_msg', 'This category does not exist!');
		res.redirect('/admin/orchids/create');
		return;
	} else {
		let neworchid = new OrchidModel({
			name: name,
			image: image,
			isNatural: isNatural,
			origin: origin,
			category: catResult._id,
		});
		let data = await neworchid.save().then((rs) => rs);
		req.flash('success_msg', 'Orchid created successfully');
		res.redirect('/admin/orchids/create');
		return;
	}
};

const getOrchidDetail = async (req, res, next) => {
	const name = req.params.name;

	let orchid = await OrchidModel.findOne({
		name: name,
	})
		.populate('category', 'name')
		.populate('comments.author')
		.then((rs) => {
			return rs;
		})
		.catch((err) => console.log(err));
	console.log(orchid);
	res.render('detail/orchid', {
		orchid: orchid,
	});
};

const getOrchidPage = async (req, res, next) => {
	const search = req.query.search;
	console.log(search);
	if (search && search.trim() !== '') {
		let orchids = await OrchidModel.find({
			name: { $regex: '.*' + search + '.*' },
		})
			.populate('category', 'name')
			.then((rs) => {
				return rs;
			})
			.catch((err) => console.log(err));
		res.render('orchid/OrchidPage', {
			orchids: orchids.map((orchid) => orchid.toJSON()),
		});
	} else {
		let orchids = await OrchidModel.find()
			.populate('category', 'name')
			.then((rs) => {
				return rs;
			})
			.catch((err) => console.log(err));
		res.render('orchid/OrchidPage', {
			orchids: orchids.map((orchid) => orchid.toJSON()),
		});
	}
};

const renderAdminOrchid = async (req, res, next) => {
	const search = req.query.search;
	console.log(search);
	if (search && search.trim() !== '') {
		let orchids = await OrchidModel.find({
			name: { $regex: '.*' + search + '.*' },
		})
			.populate('category', 'name')
			.then((rs) => {
				return rs;
			})
			.catch((err) => console.log(err));
		res.render('admin/orchid', {
			orchids: orchids.map((orchid) => orchid.toJSON()),
		});
	} else {
		let orchids = await OrchidModel.find()
			.populate('category', 'name')
			.then((rs) => {
				return rs;
			})
			.catch((err) => console.log(err));
			console.log(orchids)
		res.render('admin/orchid', {
			orchids: orchids.map((orchid) => orchid.toJSON()),
		});
	}
};

const renderCreateOrchid = async (req, res, next) => {
	let categories = await CategoryModel.find()
		.then((rs) => rs)
		.catch((err) => console.log(err));
	res.render('admin/create/orchid', {
		categories: categories.map((Category) => Category.toJSON()),
	});
};

const renderUpdateOrchid = async (req, res, next) => {
	const orchidName = req.params.name;
	let orchid = await OrchidModel.findOne({ name: orchidName })
		.populate('category', 'name')
		.then((rs) => rs)
		.catch((err) => console.log('err in getorchidupdate ', err));
	let categories = await CategoryModel.find()
		.then((rs) => rs)
		.catch((err) => console.log(err));
	res.render('admin/update/orchid', {
		orchid: orchid.toJSON(),
		categories: categories.map((Category) => Category.toJSON()),
	});
};

const updateOrchid = async (req, res, next) => {
	let body = req.body;
	console.log('create request: ' + JSON.stringify(body));
	const id = body.id;
	const name = body.name;
	const image = body.image;
	const origin = body.origin;
	const isNatural = body.isNatural === 'true' ? true : false;
	const categoryName = body.category;

	if (!name || !image || !origin || !categoryName) {
		req.flash('error_msg', 'Please enter all field!');
		res.redirect('back');
		return;
	}

	if (!validUrl(image)) {
		req.flash('error_msg', 'Please enter a valid image Url');
		res.redirect('back');
		return;
	}

	await OrchidModel.findOne({ name: name }).then(async (orchid) => {
		if (orchid && orchid.id !== id) {
			req.flash('error_msg', 'Duplicated name!');
			res.redirect('back');
			return;
		}
	});

	const catResult = await CategoryModel.findOne({ name: categoryName }).then(
		(category) => category
	);

	if (!catResult) {
		req.flash('error_msg', 'This category does not exist!');
		res.redirect('back');
		return;
	}
	await OrchidModel.findByIdAndUpdate(id, {
		name: name,
		image: image,
		isNatural: isNatural,
		origin: origin,
		category: catResult._id,
	})
		.then((orchid) => {
			req.flash('success_msg', 'Orchid updated successfully');
			res.redirect(`/admin/orchid/${name}`);
		})
		.catch((err) => console.log(err));

	return;
};

const deleteOrchid = async (req, res, next) => {
	const orchidname = req.params.name;
	console.log(orchidname);
	await OrchidModel.deleteOne({ name: orchidname });
	req.flash('success_msg', 'Orchid deleted successfully');
	res.status(200).redirect('/admin/orchids');
};

const createComment = async (req, res, next) => {
	const { comment, rating, id, userid } = req.body;

	if (!comment || comment.trim() === '') {
		req.flash('error_msg', 'Please write a comment first');
		res.redirect('back');
		return;
	}

	if (rating > 5 || rating < 1 || isNaN(rating) || !rating) {
		req.flash('error_msg', 'Please select a valid rating');
		res.redirect('back');
		return;
	}

	const parentOrchid = await OrchidModel.findById(id).then(
		(orchid) => orchid
	);
	if (!parentOrchid) {
		req.flash('error_msg', 'Orchid not found');
		res.redirect('back');
		return;
	}

	const userFound = await OrchidModel.findById(
		id,
		{
			comments: { $elemMatch: { ['author']: userid } }, // $elemMatch within the projection
		}	
	).then(result => result)

	if(userFound) {
			
			req.flash('error_msg', 'You have already commented');
			res.redirect('back');
			return;
	}

	await parentOrchid.comments.push({
		comment: comment,
		rating: rating,
		author: userid,
	});

	const saveparent = await parentOrchid.save().then((res) => res);
	if (saveparent) {
		await saveparent
			.populate('comments.author', 'name')
			.then((res) => console.log('populate res', res));
		req.flash('success_msg', 'Comment added successfully');
		res.render('detail/orchid', {
			orchid: parentOrchid,
		});
		return;
	}
};

module.exports = {
	getOrchidPage,
	createComment,
	getOrchidDetail,
	createOrchid,
	updateOrchid,
	renderCreateOrchid,
	renderUpdateOrchid,
	deleteOrchid,
	renderAdminOrchid,
};
