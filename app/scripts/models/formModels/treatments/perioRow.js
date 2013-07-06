define(['backbone','underscore'], function(Backbone,_) {

	var PerioRow = Backbone.Model.extend({
		defaults: function() {
			return {
				patientName: '',
				patient:null,
				doctorName: '',
				doctor:null,
				treatmentName: '',
				treatment:null,
				quadrant:"",
				sitting:'',
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
		    quadrant: {
		    	required: true,
		    	msg: "Please enter a valid quadrant"
		    },
  		    sitting: {
		    	pattern: 'digits',
		    	required: true,
		    	range: [1, 6],
		    	msg: "Please enter a valid sitting number"
		    }

		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
	});

	return PerioRow;

});