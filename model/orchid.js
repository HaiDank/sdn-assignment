const mongoose = require('mongoose');
const {commentSchema }= require('../model/comments')

const orchidSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		image: { type: String, required: true },
		isNatural: { type: Boolean, default: false },
		origin: { type: String, required: true },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'category',
		},
		comments: [commentSchema],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('orchid', orchidSchema);
