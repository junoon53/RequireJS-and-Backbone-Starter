define(['backbone'], function(Backbone) {

	var Patient = Backbone.Model.extend({
		url:'http://192.168.211.132:8080/patients'
	});

	return Patient;
});