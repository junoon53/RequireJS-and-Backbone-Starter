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
		/*validate: function(attrs,options) {
			var validationError = [];

			if(!_.isNumber(parseInt(attrs.patient,10))) 
				validationError.push({attribute:"patientName",message:"No patient selected!"});

			if(!_.isNumber(parseInt(attrs.feedback,10)) || parseInt(attrs.feedback < 0))
				validationError.push({attribute:"feedback",message:"Invalid feedback!"});

		    if(validationError.length>0)
		     return validationError;
        }*/
	});

	return PatientsFeedbackRow;
});