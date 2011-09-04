var crypto = require('crypto');

// Generates a random string of len chars.
function randomString(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function signup_mix_password(pass) {
  var salt = utils.randomString(12);
  return crypto.createHmac('sha256', salt).update(pass).digest('hex') + ':' + salt;
}

function hash_password(pass, salt) {
  return crypto.createHmac('sha256', salt).update(pass).digest('hex');
}

function split_pass_mix(mixed_pass) {
 return {
  salt: mixed_pass.slice(65),
  password: mixed_pass.slice(0, 64)
 }
}

module.exports.randomString = randomString;
module.exports.signup_mix_password = signup_mix_password;
module.exports.hash_password = hash_password;
module.exports.split_pass_mix = split_pass_mix;
