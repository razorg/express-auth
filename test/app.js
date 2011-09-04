var express = require('express')
	, querystring = require('querystring')
	, app = module.exports = express.createServer();

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.use(app.router);
});

app.post('/signup', function (req, res) {
	console.log(req.body);
	console.log(req.query);
	console.log(req.param('username'));
	res.send(200);
});

app.get('/', function (req, res) {
	res.send('<form action="/signup" method="post"><input type="text" name="username"></form>');
});

app.listen(8080);