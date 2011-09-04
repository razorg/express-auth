module.exports = {
	username: { type: String },
	password: { type: String },
	dateCreated: {
		type: String,
		default: Date.now
	}
}