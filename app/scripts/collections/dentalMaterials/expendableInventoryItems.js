define(['backbone','models/dentalMaterials/expendableInventoryItem'], function(Backbone,ExpendableInventoryItem) {

	var ExpendableInventoryItems = Backbone.Collection.extend({
		model: ExpendableInventoryItem,
		url: 'http://192.168.211.132:8080/expendableInventoryMaster'
	});

	return ExpendableInventoryItems;

});