define([
	'backbone',
	'jquery', 
	'underscore',
	'models/dentalMaterials/inventoryReceivedRow',
	'collections/dentalMaterials/inventoryReceivedRowList',
	'views/inventoryReceived/inventoryReceivedRowView',
	'vent',
	'text!templates/inventoryReceivedTable.html'
	], function(Backbone,$,_,InventoryReceivedRow,InventoryReceivedRowList,InventoryReceivedRowView,vent,template){

	var InventoryReceivedTableView = Backbone.View.extend({
		model: new InventoryReceivedRowList(),
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(this.model,'reset' , this.removeAllRowViews);	
			this.listenTo(this.model,'add', this.addRow);
		},
		reset: function(){
			this.model.reset();
		},
		onClose: function(){

			this.removeAllRowViews();
		},
		handleNewRowSubmit: function(ev){
			ev.preventDefault();
			this.model.add(new InventoryReceivedRow());
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

	    	var rowView = new InventoryReceivedRowView({model: rowModel});
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
		addDataFromReport: function(data){
			this.model.addDataFromReport(data);
		},
		getDataForReport: function(){
			return this.model.getDataForReport();
		}
	});

	return InventoryReceivedTableView;

});