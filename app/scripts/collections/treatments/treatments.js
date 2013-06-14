define(['backbone','models/treatments/treatment'], function(Backbone,Treatment) {

	var Persons = Backbone.Collection.extend({
		model: Treatment,
		url: 'http://54.245.100.246:8080/treatments'
	});

	return Persons;

});