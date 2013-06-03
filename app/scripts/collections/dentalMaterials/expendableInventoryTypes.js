define(['backbone','models/dentalMaterials/expendableInventoryType'], function(Backbone,ExpendableInventoryType) {

	var ExpendableInventoryTypes = Backbone.Collection.extend({
		model: ExpendableInventoryType,
		url: 'http://192.168.211.132:8080/expendableInventoryTypes'
	});

	return ExpendableInventoryTypes;

});