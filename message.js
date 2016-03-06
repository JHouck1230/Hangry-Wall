'use strict';

var messagesFilename = './data/messages.json'

var fs = require('fs');

exports.read = function (callback) {
	fs.readFile(messagesFilename, function(err, data) {
		var messages = JSON.parse(data);
		callback(err, messages);
	})
};

exports.write = function (messages, callback) {
	var messagesJSON = JSON.stringify(messages);
	fs.writeFile(messagesFilename, messagesJSON, function (err) {
		callback(err);
	});
};

