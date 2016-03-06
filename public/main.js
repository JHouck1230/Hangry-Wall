'use strict';

$(function () {
	loadMessages();
	$(document).on('click', '.remove', removePost);
})

function loadMessages() {
	$.get('http://localhost:6789/messages')
		.done(function(data) {
			var $post = data.map(function(post) {
				$post = $('#template').clone();
				$post.removeAttr('id');
				$post.find('.author').append(post.author);
				$post.find('.time').append(moment(post.time).format(' h:mm:ss a, MMMM Do YYYY'));
				$post.find('.body').append(post.body);
				return $post;
			});
			$('#forum').append($post);
		})
		.fail(function(err) {
			console.error(err);
		});
}

function removePost(event) {
	event.preventDefault();
	event.stopPropagation();
	var $this = $(this);
	var index = $this.closest('.post').index();
	console.log(index);
	$.ajax({
		url:`http://localhost:6789/messages/${index}`,
		mehtod: 'DELETE',
		success: function(data) {
			$this.closest('.post:not(#template)').remove();
		},
		error: function(err) {
			console.error(err);
		}
	});
}











