define([
	'backbone',
	'jquery', 
	'underscore',
	'models/treatments/crownNBridgeRow',
	'collections/treatments/crownNBridgeRowList',
	'views/treatments/crownNBridgeRowView',
	'vent',
	'text!templates/crownNBridgeTable.html'
	], function(Backbone,$,_,CrownNBridgeRow,CrownNBridgeRowList,CrownNBridgeRowView,vent,template){

	var CrownNBridgeTableView = Backbone.View.extend({
		model: new CrownNBridgeRowList(),
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(vent,'CDF.Views.CrownNBridge.CrownNBridgeRowView:exitColumn:amount', this.updateTotal);
			this.listenTo(vent,'CDF.Views.CrownNBridge.CrownNBridgeRowView:onValid', this.updateTotal);

			this.listenTo(vent,'CDF.Views.CrownNBridge.CrownNBridgeRowView:delete', this.updateTotal);
			this.listenTo(this.model,'reset' , this.removeAllRowViews);	
			this.listenTo(this.model,'add', this.addRow);
		},
		onClose: function(){

			this.removeAllRowViews();
		},
		handleNewRowSubmit: function(ev){
			ev.preventDefault();
			this.model.add(new CrownNBridgeRow());
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

	    	var rowView = new CrownNBridgeRowView({model: rowModel});
	    	rowView.render();    			

	    	this.rowViews.push(rowView);
			this.$('#rows-container').append((rowView.$el));
		},
		removeAllRowViews: function() {
			for(var i=0;i<this.rowViews.length;i++){
				this.rowViews[i].close();
			}
		},
		render: function() {

			var self = this;
			this.$el.html(this.template(this.model.toJSON()));	
			return this;
		}
	});

	return CrownNBridgeTableView;

});