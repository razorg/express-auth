// Copyright(c) Damianos Mylonakis <danmylonakis@gmail.com> 2011

/**
 * @fileoverview Middleware and helper functions of
 * user authentication.
 * @author danmylonakis@gmail.com (Damianos Mylonakis)
 */

var utils = require('./utils')

/**
 * Global variables for
var config = null;
var UserModel = null;
var mongoose = null;


function sign_up_user(user_obj, callback) {
  user_model = mongoose.model('User');
  var user = new user_model();
  var keys = Object.keys(user_obj);
  for (var i in keys) {
    var key = keys[i];
    if (typeof user.schema.path(key).path == 'undefined')
      throw Error('passed user object does not have ' + key + ' key');
    if (key == 'password')
      user[key] = utils.signup_mix_password(user_obj[key]);
    else
      user[key] = user_obj[key];
  }
  user.save(callback);
}

function username_exists(username, callback) {
  user_model = mongoose.model('User');
  user_model.findOne({ username : username }, callback);
}

function logged_only(success, fail) {
  return function(req, res) {
				if (req.get_current_user())
						success(req, res)
				else
						fail(req, res)
		}
}

function Middleware(options) {
  if (!options)
    throw new Error('You need to specify the module configuration');
  
  config = options;
  UserModel = require(config['user_model'] || './models/User.js').User;
  mongoose = config['mongoose'];
  mongoose.model('User', UserModel);
  if (typeof mongoose == 'undefined')
    throw new Error("need mongoose parameter");
  
  return function(req, res, next) {
    if (!req.session)
      return next();
    // populate with data
    req.user_model = UserModel;
    
    res.update_user_session = function(session, user_obj) {
      user_model = mongoose.model('User');
      
      if (!req.get_current_user())
        session['User'] = { };
      
      var user = req.get_current_user();
      user_obj.schema.eachPath(function(key) {
        var needs_store = user_model.schema.path(key).options['in_session'];
        if ((typeof needs_store == 'undefined') ||
            (needs_store == true)) {
          user[key] = user_obj[key];
        }
      });
    }
    
    // populate with functions
    res.try_login = function(user_obj, callback) {
      user_model = mongoose.model('User');
      var passwd = user_obj.password;
      delete user_obj.password;
      user_model.findOne(user_obj, function(err, user_obj) {
        if (user_obj) {
          var de_mixed = utils.split_pass_mix(user_obj.password);
          var hashed_pass = utils.hash_password(passwd, de_mixed.salt);
          if (hashed_pass == de_mixed.password) {
            res.update_user_session(req.session, user_obj);
            callback(true);
          }
          callback(false);
        }
        else
          callback(false);
      });
    }
    
    res.logout = function(callback) {
      delete req.session.User;
    }
    
    req.get_current_user = function() {
      return (req.session.User || null);
    }
    
    req.is_logged = function(callback) {
      if (req.get_current_user())
        callback(true);
      else
       callback(false);
    }
    
    return next();
  }
};

module.exports.sign_up_user = sign_up_user;
module.exports.username_exists = username_exists;
module.exports.logged_only = logged_only;
module.exports.Middleware = Middleware;
