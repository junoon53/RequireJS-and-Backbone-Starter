define(['backbone','models/formModels/people/person','config'], function(Backbone,Person,config) {

	var Persons = Backbone.Collection.extend({
		model: Person,
		url: config.serverUrl+'persons'
	});

	return Persons;

});