define(['backbone'], function(Backbone) {

	var RevenueRow = Backbone.Model.extend({
		//url: 'http://192.168.211.132:8080/revenue',
		defaults: function() {
			return {
				patientName: '',
				patient:"null",
				doctorName: '',
				doctor:"null",
				amount:0,
				paymentOptionName:"CASH",
				paymentOption:"null",
				rowId:0,
				clinic:"",
				date: new Date(),
				markedForDeletion: false
			}
		},
		validate: function(attrs, options) {
			this.validationError = "";

			if(attrs.patientId === "null") 
				this.validationError += "No patient selected!\r\n";

			if(attrs.doctorId === "null") 
				this.validationError += "No doctor selected!\r\n";

			if(parseInt(attrs.amount,10) <= 0) 
				this.validationError += "Invalid amount!\r\n";

			if(attrs.markedForDeletion) {
				this.validationError += "Marked for Deletion!\r\n";
			}				

		    if(this.validationError.length>0)
		     return this.validationError;
		}
		
	});

	return RevenueRow;

});