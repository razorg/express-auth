var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

function connector(schema, options) {
	this.model = mongoose.model('User', new Schema(schema));
}

connector.prototype.create = function (obj, callback) {
	newInstance = new this.model(obj);
	newInstance.save(function (err) {
		if (err)
			callbacK(err);
		else
			callback();
	});
}

connector.prototype.find = function (obj, callback) {
	this.model.find(obj, callback);
}

module.exports = connector;