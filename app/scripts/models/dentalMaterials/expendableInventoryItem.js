define(['backbone'], function(Backbone) {

	var ExpendableInventoryItem = Backbone.Model.extend({
		url:'http://192.168.211.132:8080/expendableInventoryMaster',
		defaults: {
			genericName:"",
			brandName:"",
			accountingUnit:"",
			expendableInventoryType:0,
		}
	});

	return ExpendableInventoryItem;
});