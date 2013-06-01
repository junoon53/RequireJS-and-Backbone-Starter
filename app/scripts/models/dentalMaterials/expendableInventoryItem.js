define(['backbone'], function(Backbone) {

	var ExpendableInventoryItem = Backbone.Model.extend({
		defaults: {
			genericName:"",
			brandName:"",
			accountingUnit:"",
			expendableInventoryType:null
		}
	});

	return ExpendableInventoryItem;
});