var crypto = require('crypto');

// Generates a random string of len chars.
function randomString(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

exports.hashPassword = function (pass, salt) {
  if (typeof salt === 'undefined')
    var salt = randomString(salt);
  else if (typeof salt === 'number')
    var salt = randomString(salt);
  
  return crypto.createHmac('sha256', salt).update(pass).digest('hex') + ':' + salt;
}

function hash_password(pass, salt) {
  return crypto.createHmac('sha256', salt).update(pass).digest('hex');
}

exports.splitHashedPass = function (mixed_pass) {
 return {
  salt: mixed_pass.slice(65),
  password: mixed_pass.slice(0, 64)
 }
}

module.exports.hash_password = hash_password;