define([
	'backbone',
	'jquery', 
	'underscore',
	'models/dentalMaterials/inventoryRequiredRow',
	'views/inventoryRequired/inventoryRequiredRowView',
	'vent',
	'text!templates/inventoryRequiredTable.html'
	], function(Backbone,$,_,InventoryRequiredRow,InventoryRequiredRowView,vent,template){

	var InventoryRequiredTableView = Backbone.View.extend({
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(this.model,'reset' , this.removeAllRowViews);	
			this.listenTo(this.model,'add', this.addRow);
		},
		onClose: function(){

			this.removeAllRowViews();
		},
		handleNewRowSubmit: function(ev){
			ev.preventDefault();
			this.model.add(new InventoryRequiredRow());
		},
		isValid: function() {
			var result = this.model.isValid();
			if(!result){
				this.$('.alert').hide();
				this.$('.alert-error').show(); 
			} else {
				this.$('.alert').hide();
			}
			return result;
		},	
		addRow: function(rowModel){		

	    	var rowView = new InventoryRequiredRowView({model: rowModel});
	    	rowView.render();    			

	    	this.rowViews.push(rowView);
			this.$('#rows-container').append((rowView.$el));
		},
		removeAllRowViews: function() {
			//this.$('#rows-container').html('');
			for(var i=0;i<this.rowViews.length;i++){
				this.rowViews[i].close();
			}
		},
		render: function() {

			var self = this;
			this.$el.html(this.template(this.model.toJSON()));	
			return this;
		},
	});

	return InventoryRequiredTableView;

});