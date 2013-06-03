define(['backbone'], function(Backbone) {

	var ExpendableInventoryType = Backbone.Model.extend({
		defaults: {
			name:"",
		}
	});

	return ExpendableInventoryType;
});