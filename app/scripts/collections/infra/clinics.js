define(['backbone'], function(Backbone) {

	var Clinics = Backbone.Collection.extend({
		model: CDF.Models.Infra.Clinic,
		url: 'http://54.245.100.246:8080/clinics'
	});

	return Clinics;
});
