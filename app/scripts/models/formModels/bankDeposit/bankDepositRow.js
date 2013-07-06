define(['backbone','underscore'], function(Backbone,_) {

	var BankDepositRow = Backbone.Model.extend({
		defaults: {
			person:null,
			personName:"",
			amount:0
		},
		validation: {
		    person: {
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a person"
		    },
		    amount: {
		    	pattern: 'digits',
		    	required: true,
		    	range: [1, 1000000],
		    	msg: "Please enter a valid amount"
		    }
		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
		/*validate: function(attrs,options) {
			var validationError = [];

			if(!_.isNumber(parseInt(attrs.person,10))) 
				validationError.push({attribute:"personName",message:"No person selected!"});

			if(!_.isNumber(parseInt(attrs.amount,10)) || parseInt(attrs.amount < 0))
				validationError.push({attribute:"amount",message:"Invalid amount!"});

		    if(validationError.length>0)
		     return validationError;
        }*/
	});

	return BankDepositRow;
});