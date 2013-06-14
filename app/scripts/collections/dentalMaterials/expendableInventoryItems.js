define(['backbone','models/dentalMaterials/expendableInventoryItem'], function(Backbone,ExpendableInventoryItem) {

	var ExpendableInventoryItems = Backbone.Collection.extend({
		model: ExpendableInventoryItem,
		url: 'http://54.245.100.246:8080/expendableInventoryMaster'
	});

	return ExpendableInventoryItems;

});