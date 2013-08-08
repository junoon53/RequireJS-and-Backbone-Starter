define([
	'backbone',
	'jquery',
	'underscore',
	'utility',
	'models/formModels/dentalMaterials/expendableInventoryItem',
	'vent',
	'text!templates/inventoryRecordsRow.html',
	'bootstrap',
	
	], function(Backbone,$,_,utility,Item,vent,template){

	var InventoryItemRowView = Backbone.View.extend({
		//model: new InventoryItemRow(),
		tagName:'tr',
		className: 'itemRow',
		events: {

		},
		initialize: function() {
			this.template = _.template(template);
		},
		
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.InventoryRecords.InventoryItemRowView:delete');			
			this.close();
		},
		render: function() {
			this.model.set("rowId",this.model.cid,{silent:true});
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	
	});

	return InventoryItemRowView;

});