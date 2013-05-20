define(['backbone','models/people/person'], function(Backbone,Person) {

	var Persons = Backbone.Collection.extend({
		model: Person,
		url: 'http://192.168.211.132:8080/persons'
	});

	return Persons;

});