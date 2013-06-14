define(['backbone','models/dentalMaterials/expendableInventoryType'], function(Backbone,ExpendableInventoryType) {

	var ExpendableInventoryTypes = Backbone.Collection.extend({
		model: ExpendableInventoryType,
		url: 'http://54.245.100.246:8080/expendableInventoryTypes'
	});

	return ExpendableInventoryTypes;

});