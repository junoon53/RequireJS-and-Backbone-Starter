define(['backbone','config'], function(Backbone,config) {

	var ExpendableInventoryItem = Backbone.Model.extend({
		url:config.serverUrl+'expendableInventoryMaster',
		defaults: {
			genericName:"",
			brandName:"",
			accountingUnit:"",
			expendableInventoryType:0,
		}
	});

	return ExpendableInventoryItem;
});