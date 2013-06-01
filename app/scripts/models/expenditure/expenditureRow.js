define(['backbone','underscore'], function(Backbone,_) {

	var ExpenditureRow = Backbone.Model.extend({
		defaults: {
			item:'',
			sanctionedByName:"",
			sanctionedBy:null,
			receivedByName:"",
			receivedBy:null,
			qty:0,
			amount:0
		},
		validation: {
			item: {
		      required: true,
		      msg: "Please enter an item"
		    },
		    sanctionedBy: {
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a sanctioner"
		    },
		    receivedBy: {
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a receiver"
		    },
		    amount: {
		    	pattern: 'digits',
		    	required: true,
		    	range: [1, 1000000],
		    	msg: "Please enter a valid amount"
		    },
		    qty: {
		    	pattern: 'digits',
		    	required: true,
		    	range: [1, 1000],
		    	msg: "Please enter a valid quantity"
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

	return ExpenditureRow;
});