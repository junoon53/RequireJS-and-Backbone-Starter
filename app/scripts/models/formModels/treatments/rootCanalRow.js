define(['backbone','underscore'], function(Backbone,_) {

	var RootCanalRow = Backbone.Model.extend({
		defaults: function() {
			return {
				stage:null,
				stageName: '',
				patientName: '',
				patient:null,
				doctorName: '',
				doctor:null,
				treatmentName: '',
				treatment:null,
				tooth:0,
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
		    stage: {
		      pattern: 'digits',
		      required: true,
		      range: [0,50],
		      msg: "Please select a treatment stage"
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
		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
	});

	return RootCanalRow;

});