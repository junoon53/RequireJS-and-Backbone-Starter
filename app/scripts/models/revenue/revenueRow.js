define(['backbone','underscore','config'], function(Backbone,_,config) {

	var RevenueRow = Backbone.Model.extend({
		//url: config.serverUrl+'revenue',
		defaults: function() {
			return {
				patientName: '',
				patient:null,
				doctorName: '',
				doctor:null,
				amount:0,
				paymentOption:0,
				paymentOptionName: "CASH",
				rowId:0,
			}
		},
		validation: {
		    patient: {
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a patient"
		    },
		    doctor: {
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a doctor"
		    },
		    amount: {
		    	pattern: 'digits',
		    	required: true,
		    	range: [1, 1000000],
		    	msg: "Please enter a valid amount"
		    }
		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
		/*validate: function(attrs, options) {
			var validationError = [];

			if(!_.isNumber(parseInt(attrs.patient,10))) 
				validationError.push({attribute: "patientName",message:"No patient selected!"});

			if(!_.isNumber(parseInt(attrs.doctor,10))) 
				validationError.push({attribute: "doctorName",message:"No doctor selected!"});

			if(!_.isNumber(parseInt(attrs.amount,10)) || parseInt(attrs.amount) < 0)
				validationError.push({attribute: "amount",message:"Invalid amount!"});

		    if(validationError.length>0)
		     return validationError;
		},*/
		
	});

	return RevenueRow;

});