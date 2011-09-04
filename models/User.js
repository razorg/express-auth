var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


module.exports.User = new Schema({
  username : { type: String, required : true, index : { unique:true } },
  password : { type: String, required : true, in_session:false },
});
