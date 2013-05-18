define(['backbone'], function(Backbone) {

	var Doctor = Backbone.Model.extend({
		url:'http://192.168.211.132:8080/doctors'
	});

	return Doctor;

});