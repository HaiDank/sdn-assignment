const CategoryModel = require('../model/category');

const insert = async (req, res, next) => {
	let { name } = req.body;
	let errors = [];
	CategoryModel.findOne({ name: name }).then((categoryDuplicate) => {
		if (categoryDuplicate) {
			errors.push({ msg: 'The category has already existed' });
			res.status(400).render('admin/create/category', {
				errors,
			});
		} else {
			let newCategory = new CategoryModel();
			newCategory.name = name;

			newCategory.save().then((rs) => rs);
			res.status(200).render('admin/create/category', {
				message: 'Category created successfully',
			});
		}
	});
};

const renderAdminCategory = async (req, res, next) => {
	const search = req.query.search;
	console.log(search);
	if (search && search.trim() !== '') {
		let categories = await CategoryModel.find({
			name: { $regex: '.*' + search + '.*' },
		})
			.then((rs) => rs)
			.catch((err) => console.log(err));
		res.render('admin/category', {
			categories: categories.map((Category) => Category.toJSON()),
		});
	} else {
		let categories = await CategoryModel.find()
			.then((rs) => rs)
			.catch((err) => console.log(err));
		res.render('admin/category', {
			categories: categories.map((Category) => Category.toJSON()),
		});
	}
};

const renderCreateCategory = async (req, res, next) => {
	res.render('admin/create/category');
};

const renderCategoryUpdate = async (req, res, next) => {
	const name = req.params.name;
	let category = await CategoryModel.findOne({ name: name })
		.then((rs) => rs)
		.catch((err) => console.log(err));
	console.log(category.toJSON());
	res.render('admin/update/category', {
		category: category.toJSON(),
	});
};

const update = async (req, res, next) => {
	let body = req.body;
	console.log(body);
	CategoryModel.findOne({ name: body.name })
		.then(async (categoryDuplicate) => {
			if (categoryDuplicate) {
				req.flash('error_msg', 'Duplicated name!');
				res.redirect('back');
			} else {
				const CategoryId = req.body.id;
				const updateCategory = {};
				updateCategory.name = body.name;
				const result = await CategoryModel.findByIdAndUpdate(
					CategoryId,
					updateCategory,
					{
						new: true,
					}
				).then((rs) => rs);
				req.flash('success_msg', 'Update successfully');
				res.status(200).redirect(`/admin/category/${result.name}`);
			}
		})
		.catch((err) => console.log(err));
};

const deleteCategory = async (req, res, next) => {
	const CategoryName = req.params.name;
	const result = await CategoryModel.deleteOne({ name: CategoryName });

	req.flash('success_msg', 'Delete successfully');
	res.status(200).redirect('/admin/categories');
};

module.exports = {
	insert,
	update,
	deleteCategory,
	renderAdminCategory,
	renderCategoryUpdate,
	renderCreateCategory,
};
