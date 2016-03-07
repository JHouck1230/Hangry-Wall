'use strict';

$(function () {
	loadMessages();
	$(document).on('click', '.remove', removePost);
	$(document).on('click', '#submit', addPost);
	$(document).on('click', '.like', likePost);
})

function loadMessages() {
	$.get('http://localhost:6789/messages')
		.done(function(data) {
			var $post = data.map(function(data) {
				$post = $('#template').clone();
				$post.removeAttr('id');
				$post.find('.author').append(data.author);
				$post.find('.time').append(moment(data.time).format(' h:mm:ss a, MMMM Do YYYY'));
				$post.find('.body').append(data.body);
				$post.find('.likeCount').text(data.likes + ' Likes');
				return $post;
			});
			$('#forum').prepend($post);
		})
		.fail(function(err) {
			console.error(err);
		});
}

function removePost(event) {
	event.preventDefault();
	var $this = $(this);
	var index = $this.closest('.post').index();
	$.ajax({
		url:`/messages/${index}`,
		method: 'DELETE',
		success: function(data) {
			return $this.closest('.post:not(#template)').remove();
		},
		error: function(err) {
			return console.error(err);
		}
	});
}

function addPost(event) {
	event.preventDefault();
	event.stopPropagation();
	if($('#newRantBox').val() && $('#userName').val()) {
		var body = $('#newRantBox');
		var author = $('#userName');
		var time = Date.now();
		$.ajax({
			url: 'http://localhost:6789/messages',
			method: 'POST',
			data: {
				body: body.val(),
				author: author.val(),
				time: time,
				likes: 0
			},
			success: function(data) {
				var $post = $('#template').clone();
				$post.removeAttr('id');
				$post.find('.author').append(author.val());
				$post.find('.time').append(moment(time).format(' h:mm:ss a, MMMM Do YYYY'));
				$post.find('.body').append(body.val());
				$('#forum').prepend($post);
				body.val('');
				author.val('');
			},
			error: function(err) {
				return console.error(err);
			}
		});
	}
}

function likePost(event) {
	event.preventDefault();
	var $this = $(this);
	var count = $this.closest('.buttons').find('.likeCount').text();
	var index = $this.closest('.post').index();
	$.ajax({
		url: `/messages/${index}`,
		method: 'PUT',
		success: function(data) {;
			$this.closest('.buttons').find('.likeCount').text(parseInt(count) + 1 + ' Likes');
		},
		error: function(err) {
			console.error(err);
		}
	})
}






