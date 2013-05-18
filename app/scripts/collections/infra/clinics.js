define(['backbone'], function(Backbone) {

	var Clinics = Backbone.Collection.extend({
		model: CDF.Models.Infra.Clinic,
		url: 'http://192.168.211.132:8080/clinics'
	});

	return Clinics;
});
