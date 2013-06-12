define(['backbone','models/treatments/treatment'], function(Backbone,Treatment) {

	var Persons = Backbone.Collection.extend({
		model: Treatment,
		url: 'http://192.168.211.132:8080/treatments'
	});

	return Persons;

});