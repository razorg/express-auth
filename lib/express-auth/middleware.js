var utils = require('./utils');

module.exports = function (options) {
  if (!options)
    throw new Error('no module configuration given');
  
  if (!options.connector)
    throw new Error('no connector key in configuration');
  
  var userSchema = options['userModel'] || require('./default-user-schema');
  var connector = new options.connector(userModel, options.connectorOptions);

  return function(req, res, next) {
    if (!req.session)
      throw new Error('express-auth middleware requires session support');
    
    function setUser(to) {
      req.session.user = to;
    }
    req.auth = {
      create: function (user, callback) {
        for (var key in user) {
          if ((key === 'password') || (user[key].isPassword === true)) {
            user[key] = utils.hashPassword(user[key]);
            break;
          }
        }
        connector.create(user, callback);
      },
      auth: function (user, callback) {
        var passwd;
        for (var key in user) {
          if ((key === 'password') || (user[key].isPassword === true)) {
            delete user[key];
            break;
          }
        }
        connector.find(user, function (err, user_db) {
          if (err) {
            callback(err);
          }
          else {
            if (userDB) {
              for (var key in userDB) {
                if ((key === 'password') || (userDB[key].isPassword === true)) {
                  var splitted = utils.splitHashedPass(userDB[key]);
                  var newHash = utils.hashPassword(passwd, splitted.salt);
                  if (newHash === userDB[key]) {
                    setUser(userDB);
                    callback(undefined, true, userDB);
                  }
                  else {
                    callback(undefined, false, userDB);
                  }
                  break;
                }
              }
            }
            else {
              setUser(undefined);
              callback(undefined, false, undefined);
            }
          }
        });
      },
      user: function () {
        return req.session.user;
      },
      logout: function () {
        setUser(undefined);
      }
    }
  }
}