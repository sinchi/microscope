// Write your package code here!
Package.describe({
	name: "tmeasday:errors",
	summary: "A pattern to display application errors to the user",
	version: "1.0.0"
});

Package.onUse(function(api,where){
	api.versionsFrom('0.9.0');
	api.use(['minimongo', '']);
});