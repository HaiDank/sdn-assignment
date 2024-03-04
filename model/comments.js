const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
	{
		rating: { type: Number, min: 1, max: 5, required: true },
		comment: { type: String, required: true },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			require: true,
		},
	},
	{ timestamps: true }
);
const commentModel = mongoose.model('comment', commentSchema);
module.exports = {commentSchema, commentModel}
