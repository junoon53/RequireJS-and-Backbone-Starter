define(['backbone','underscore'], function(Backbone,_) {

	var ExtractionsRow = Backbone.Model.extend({
		defaults: function() {
			return {
				patientName: '',
				patient:null,
				doctorName: '',
				doctor:null,
				treatmentName: '',
				treatment:null,
				tooth:0,
				numInjections:0,
				remarks:'',
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
  		    numInjections: {
		    	pattern: 'digits',
		    	required: true,
		    	range: [1, 10],
		    	msg: "Please enter a valid number of injections"
		    }

		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
	});

	return ExtractionsRow;

});