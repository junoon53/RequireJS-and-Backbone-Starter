define(['backbone','models/people/doctor'], function(Backbone,Doctor) {

	var Doctors = Backbone.Collection.extend({
		model: Doctor,
		url:'http://192.168.211.132:8080/doctors'				
	});

	return Doctors;
});