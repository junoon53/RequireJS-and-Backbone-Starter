define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'vent'
	 ], function(Backbone,$,_,vent){

	var TreatmentsViewModel = Backbone.Model.extend({
		defaults: {
			treatments: []
		},
		tableTypes: ['fillings','rootCanal','crownNBridge','dentures','perio','extractions' ],
		initialize: function(){
			var self = this;
	    },
	    onClose: function(){

	    },
		isValid: function() {
			return true;
		}
		
	});

	return TreatmentsViewModel;

});
