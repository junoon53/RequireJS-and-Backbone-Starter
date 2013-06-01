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
	});

	return ClinicIssuesRow;
});