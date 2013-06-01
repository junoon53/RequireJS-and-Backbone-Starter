define(['backbone','underscore'], function(Backbone,_) {

	var ClinicIssuesRow = Backbone.Model.extend({
		defaults: {
			doctor:null,
			doctorName:"",
			issue:""
		},
		validation: {
		    doctor: {
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a doctor"
		    },
		    issue: {
		    	required: true,
		    	msg: "Please enter valid issue"
		    }
		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
		/*validate: function(attrs,options) {
			var validationError = [];

			if(!_.isNumber(parseInt(attrs.doctor,10))) 
				validationError.push({attribute:"doctorName",message:"No doctor selected!"});

			if(!_.isNumber(parseInt(attrs.issue,10)) || parseInt(attrs.issue < 0))
				validationError.push({attribute:"issue",message:"Invalid issue!"});

		    if(validationError.length>0)
		     return validationError;
        }*/
	});

	return ClinicIssuesRow;
});