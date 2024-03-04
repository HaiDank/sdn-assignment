const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
	{
		name: { type: String, require: true, unique: true },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('category', categorySchema);
