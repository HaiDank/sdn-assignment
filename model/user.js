const mongoose = require('mongoose');


const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true
		},
		password: {
			type: String
		},
		name: {
			type: String,
			required: true,
		},
		YOB: Number,
		isAdmin: {
			type: Boolean,
			default: false,
		},
		googleId: {
			type: String,
		},
	},
	{ timestamps: true }
);

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('user', userSchema);