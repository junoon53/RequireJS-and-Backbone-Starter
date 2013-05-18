define(['backbone'], function(Backbone) {

	var Clinic = Backbone.Model.extend({
		url:'http://192.168.211.132:8080/clinics'
	});

	return Clinic;

});