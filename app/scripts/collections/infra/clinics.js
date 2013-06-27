define(['backbone','config'], function(Backbone,config) {

	var Clinics = Backbone.Collection.extend({
		model: CDF.Models.Infra.Clinic,
		url: config.serverUrl+'clinics'
	});

	return Clinics;
});
