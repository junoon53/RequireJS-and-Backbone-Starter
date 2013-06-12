define([
	'backbone',
	'jquery', 
	'underscore',
	'models/revenue/revenueRow',
	'collections/revenue/revenueRowList',
	'views/revenue/revenueRowView',
	'vent',
	'text!templates/revenueTable.html'
	], function(Backbone,$,_,RevenueRow,RevenueRowList,RevenueRowView,vent,template){

	var RevenueTableView = Backbone.View.extend({
		model: new RevenueRowList(),
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:exitColumn:amount', this.updateTotal);
			this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:onValid', this.updateTotal);

			this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:delete', this.updateTotal);
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
			this.model.add(new RevenueRow());
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

	    	var rowView = new RevenueRowView({model: rowModel});
	    	rowView.render();    			

	    	this.rowViews.push(rowView);
			this.$('#rows-container').append((rowView.$el));
			this.updateTotal();		
		},
		removeAllRowViews: function() {
			//this.$('#rows-container').html('');
			for(var i=0;i<this.rowViews.length;i++){
				this.rowViews[i].close();
			}
			this.$('.total').text("");
		},
		render: function() {

			var self = this;
			this.$el.html(this.template(this.model.toJSON()));	
			return this;
		},
		updateTotal: function(){

			this.$('.total').text("Total : Rs. "+this.model.total());
		},
		addDataFromReport: function(data){
			this.model.addDataFromReport(data);
		},
		getDataForReport: function(){
			return this.model.getDataForReport();
		}
	});

	return RevenueTableView;

});