define([
	'backbone',
	'jquery', 
	'underscore',
	'models/revenue/revenueRow',
	'views/revenue/revenueRowView',
	'vent',
	'text!templates/revenueTable.html'
	], function(Backbone,$,_,RevenueRow,RevenueRowView,vent,template){

	var RevenueTableView = Backbone.View.extend({
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:exitColumn:amount', this.updateTotal, this);
			this.listenTo(this.model,'reset' , this.removeAllRowViews);			
		},
		onClose: function(){

			this.removeAllRowViews();
		},
		handleNewRowSubmit: function(ev){
			ev.preventDefault();
			this.addNewRow();
			return false;
		},	
		addNewRow: function() {
	    	var row = new RevenueRow({patientName: "", patientId:"null", doctorName:"",doctorId:"null",amount:0,paymentTypeName:"CASH",
	    												 paymentTypeId:0,rowId:0,clinicId:0,date:new Date()});
	    	this.model.add(row);

	    	var rowView = new RevenueRowView({model: row});
	    	rowView.render();    			

	    	this.rowViews.push(rowView);
			this.$('#rows-container').append((rowView.$el));			
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
		}
	});

	return RevenueTableView;

});