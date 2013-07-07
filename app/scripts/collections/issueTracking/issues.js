define(['backbone','models/issueTracking/issue','config'], function(Backbone,Issue,config) {

	var Issues = Backbone.Collection.extend({
		model: Issue,
		url: config.serverUrl+'clinicIssues'
	});

	return Issues;

});