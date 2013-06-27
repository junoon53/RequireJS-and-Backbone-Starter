define(['backbone','models/treatments/treatment','config'], function(Backbone,Treatment,config) {

	var Persons = Backbone.Collection.extend({
		model: Treatment,
		url: config.serverUrl+'treatments'
	});

	return Persons;

});