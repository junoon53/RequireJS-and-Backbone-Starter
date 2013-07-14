define(['backbone','underscore'], function(Backbone,_) {

	var FillingsRow = Backbone.Model.extend({
		defaults: function() {
			return {
				patientName: '',
				patient:null,
				doctorName: '',
				doctor:null,
				treatmentName: '',
				treatment:null,
				tooth:0,
				expendableInventoryItem:0,
				genericName:'',
				numFillings:0,
				rowId:0,
			}
		},
		validation: {
		    patient: {
		      pattern: 'digits',
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a patient"
		    },
		    expendableInventoryItem: {
		      pattern: 'digits',
		      required: true,
		      range: [1000,100000],
		      msg: "Please select a material"
		    },
		    treatment: {
		      pattern: 'digits',
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a treatment"
		    },
		    doctor: {
		      pattern: 'digits',
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a doctor"
		    },
		    tooth: {
		    	pattern: 'digits',
		    	required: true,
		    	range: [11, 100],
		    	msg: "Please enter a valid tooth"
		    },
  		    numFillings: {
		    	pattern: 'digits',
		    	required: true,
		    	range: [1, 6],
		    	msg: "Please enter a valid number of fillings"
		    }

		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
	});

	return FillingsRow;

});