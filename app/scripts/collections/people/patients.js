define(['backbone','models/people/patient'], function(Backbone,Patient) {

	var patients = Backbone.Collection.extend({
		model: Patient,
		url: 'http://192.168.211.132:8080/patients'
	});

	return patients;

});