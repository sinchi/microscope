Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function(){
		return [Meteor.subscribe('notifications')];
	}
});


Router.route('/posts/:_id', {
	name: "postPage",
	waitOn: function(){
		return [
				Meteor.subscribe('singlePost', this.params._id),
				Meteor.subscribe('comments', this.params._id)			
				];
	},
	data: function(){
		return Posts.findOne(this.params._id);
	}
});

Router.route('/posts/:_id/edit', {
	name: 'postEdit',
	waitOn: function(){
		return Meteor.subscribe('singlePost', this.params._id);
	},
	data: function(){
		return Posts.findOne(this.params._id);
	}
})

Router.route('/submit', {
	name: 'postSubmit'
});

PostsListController = RouteController.extend({
	template: 'postsList',
	increment: 5,
	postsLimit: function(){
		return parseInt(this.params.postsLimit) || this.increment;
	},
	findOptions: function(){
		return {sort: {submitted: -1}, limit: this.postsLimit()};
	},
	subscriptions:function(){
		this.postSub = Meteor.subscribe('posts', this.findOptions());
	},
	waitOn: function(){
		return Meteor.subscribe('posts', this.findOptions());
	},
	posts: function(){
		return Posts.find({}, this.findOptions());
	},
	data: function(){
		var hasMore = this.posts().count() === this.postsLimit();
		var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});
		return {
			posts: this.posts(),
			ready: this.postSub.ready,
			nextPath: hasMore ? nextPath : null
		};
	}
});

Router.route('/:postsLimit?',{
	name: 'postsList'
});



var requireLogin = function(){
	if(! Meteor.user()){
		if(Meteor.loggingIn()){
			this.render(this.loadingTemplate);
		}else{
			this.render('accessDenied');
		}
	}else{
		this.next();
	}
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});