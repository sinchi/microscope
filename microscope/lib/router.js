Router.configure({
	layoutTemplate: 'layout',
	loadingTempalte: 'loading',
	waitOn: function(){
		return Meteor.subscribe('posts');
	}
});

Router.route('/', {
	name: "postsList"
});