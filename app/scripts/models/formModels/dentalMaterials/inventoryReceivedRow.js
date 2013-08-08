define(['backbone','underscore'], function(Backbone,_) {

	var InventoryReceivedRow = Backbone.Model.extend({
		defaults: {

			expendableInventoryItem:null,
			genericName:"",
			brandName:"",
			accountingUnit:"",
			expendableInventoryType:"",
			qtyReceived:0,
			dateExpiry: new Date(),
			receivedBy: null,
			receivedByName: "",
			dateReceived: new Date()
		},
		validation: {
		    expendableInventoryItem: {
		      pattern: 'digits',
		      required: true,
		      range: [100,100000],
		      msg: "Please select an inventory item"
		    },
		    qtyReceived: {
		      pattern: 'digits',
		      required: true,
		      range: [1,1000],
		    	msg: "Please enter valid qty received"
		    },
            receivedBy: {
		      required: true,
		      range: [1000,10000],
		      msg: "Please select a receiver"
		    }

		},
		onClose: function(){
			if(this.collection)
			this.collection.remove(this);
		}
	});

	return InventoryReceivedRow;
});