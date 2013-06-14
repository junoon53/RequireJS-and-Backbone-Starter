define(['backbone'], function(Backbone) {

	var ExpendableInventoryItem = Backbone.Model.extend({
		url:'http://54.245.100.246:8080/expendableInventoryMaster',
		defaults: {
			genericName:"",
			brandName:"",
			accountingUnit:"",
			expendableInventoryType:0,
		}
	});

	return ExpendableInventoryItem;
});