define(['backbone'], function(Backbone) {

	var TreatmentStage = Backbone.Model.extend({
		url:'http://54.245.100.246:8080/treatmentStages',
		defaults: {
			stageName:"",
			category:"",
			_id:null,
		}
	});

	return TreatmentStage;
});