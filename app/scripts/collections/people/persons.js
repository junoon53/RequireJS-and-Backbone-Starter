define(['backbone','models/people/person'], function(Backbone,Person) {

	var Persons = Backbone.Collection.extend({
		model: Person,
		url: 'http://54.245.100.246:8080/persons'
	});

	return Persons;

});