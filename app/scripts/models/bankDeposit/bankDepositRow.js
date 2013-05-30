define(['backbone'], function(Backbone) {

	var BankDepositRow = Backbone.Model.extend({
		defaults: {
			_id:null,
			person:null,
			personName:null,
			date:null,
			clinic:null,
			amount:null
		},
		validate: function(attrs,options) {
			this.validationError = "";

			
		    if(this.validationError.length>0)
		     return this.validationError;
        }
	});

	return BankDepositRow;
});