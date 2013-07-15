define(['backbone','config','models/client'], function(Backbone,config,client) {

	var ExpendableInventoryItem = Backbone.Model.extend({
		url:config.serverUrl+'expendableInventoryMaster',
		defaults: {
			genericName:"",
			brandName:"",
			accountingUnit:"",
			expendableInventoryType:0,
			serverKey: client().get('serverKey')
		}
	});

	return ExpendableInventoryItem;
});