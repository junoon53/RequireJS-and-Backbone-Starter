define(['backbone','underscore'], function(Backbone,_) {

	var MiscRow = Backbone.Model.extend({
		defaults: function() {
			return {
				patientName: '',
				patient:null,
				doctorName: '',
				doctor:null,
				treatmentName: '',
				treatment:null,
				rowId:0,
				remarks:''
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
		    }
		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
	});

	return MiscRow;

});