define(['backbone','models/people/person','config'], function(Backbone,Person,config) {

	var Persons = Backbone.Collection.extend({
		model: Person,
		url: config.serverUrl+'persons'
	});

	return Persons;

});