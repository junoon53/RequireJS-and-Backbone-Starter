define(['backbone','underscore'], function(Backbone,_) {

	var InventoryRequiredRow = Backbone.Model.extend({
		defaults: {

			expendableInventoryItem:null,
			genericName:"",
			brandName:"",
			accountingUnit:"",
			expendableInventoryType:"",
			qty:""
		},
		validation: {
		    expendableInventoryItem: {
		      pattern: 'digits',
		      required: true,
		      range: [100,100000],
		      msg: "Please select an inventory item"
		    },
		    qty: {
		      pattern: 'digits',
		      required: true,
		      range: [1,1000],
		    	msg: "Please enter valid qty"
		    }
		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
	});

	return InventoryRequiredRow;
});