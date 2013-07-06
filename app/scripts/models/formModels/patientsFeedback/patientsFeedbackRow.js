define(['backbone','underscore'], function(Backbone,_) {

	var PatientsFeedbackRow = Backbone.Model.extend({
		defaults: {
			patient:null,
			patientName:"",
			feedback:""
		},
		validation: {
		    patient: {
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a patient"
		    },
		    feedback: {
		    	required: true,
		    	msg: "Please enter valid feedback"
		    }
		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
	});

	return PatientsFeedbackRow;
});