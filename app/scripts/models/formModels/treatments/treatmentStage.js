define(['backbone','config'], function(Backbone,config) {

	var TreatmentStage = Backbone.Model.extend({
		url:config.serverUrl+'treatmentStages',
		defaults: {
			stageName:"",
			category:"",
			_id:null,
		}
	});

	return TreatmentStage;
});