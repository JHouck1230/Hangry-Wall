'use strict';

const PORT = 6789;

var express = require('express');
var http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
let Messages = require('./message');

var app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/messages', function (req, res) {
	Messages.read(function (err, messages) {
		if(err) {
			return res.status(400).send(err);
		} else {
			res.status(200).send(messages)
		}
	});
});

app.post('/messages', function (req, res) {
	Messages.read(function (err, messages) {
		if(err) {
			return res.status(400).send(err);
		}
		req.body.time = parseInt(req.body.time);
		req.body.likes = parseInt(req.body.likes);
		messages.unshift(req.body);
		Messages.write(messages, function (err) {
			if(err) {
				return res.status(400).send(err);
			}
			res.send();
		});
	});
});	

app.delete('/messages/:index', function (req, res) {
	Messages.read(function (err, messages) {
		if(err) {
			return res.status(400).send(err);
		}
		var index = req.params.index;
		messages.splice(index, 1);
		Messages.write(messages, function (err) {
			if(err) {
				return res.status(400).send(err);
			}
			res.send();
		});
	});
})

app.put('/messages/:index', function(req, res) {
	Messages.read(function(err, messages) {
		if(err) {
			return res.status(400).send(err);
		}
		var index = req.params.index;
		messages[index].likes += 1;
		Messages.write(messages, function(err) {
			if(err) {
				return res.status(400).send(err);
			}
			res.send();
		})
	})
})

var server = http.createServer(app);

server.listen(PORT, function () {
	console.log(`server listening on ${PORT}`);
});