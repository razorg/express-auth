var app = require('./app')
  , assert = require('assert')
  , querystring = require('querystring');

module.exports = {
	'signup': function (beforeExit) {
		assert.response(app, {
			url: '/signup',
			timeout: 3000,
			method: 'POST',
			data: querystring.stringify({
				username: 'super',
				password: 'user'
			})
		}, {
			status: 200
		});
	}
}