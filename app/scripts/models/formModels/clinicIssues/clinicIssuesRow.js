define(['backbone','underscore'], function(Backbone,_) {

	var ClinicIssuesRow = Backbone.Model.extend({
		defaults: {
			doctor:null,
			doctorName:"",
			issue:"",
			status:"start",
			priority:""
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
		    },
		    priority: {
		    	required: true,
		    	msg: "Please enter valid priority"
		    }
		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
	});

	return ClinicIssuesRow;
});