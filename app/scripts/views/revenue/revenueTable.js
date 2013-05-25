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

			this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:exitColumn:amount', this.updateTotal);
			this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:delete', this.updateTotal);
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
	    	var row = new RevenueRow({patientName: "", patient:"null", doctorName:"",doctor:"null",amount:0,paymentOptionName:"CASH",
	    												 paymentOption:0,rowId:0,clinic:0,date:new Date()});
	    	this.model.add(row);
	    	this.addRow(row);
	    		
		},
		addRow: function(rowModel){		

	    	var rowView = new RevenueRowView({model: rowModel});
	    	rowView.render();    			

	    	this.rowViews.push(rowView);
			this.$('#rows-container').append((rowView.$el));
			this.updateTotal();		
		},
		getRevenueOnDate: function(date,clinic) {
			var self = this;
			this.model.fetch({ 
				    data: $.param({date:date,clinic:clinic}),
					success: function(collection,response,options){
								_.each(collection.models, function(element,index,array){
								// do some housekeeping... 
							    element.set('doctorName',element.get('doctor').firstName + " " + element.get('doctor').lastName);
							    element.set('patientName',element.get('patient').firstName + " " + element.get('patient').lastName);
							    element.set('doctor',element.get('doctor')._id);
							    element.set('patient',element.get('patient')._id);
							    element.set('paymentOptionName',element.get('paymentOption').name);
							    element.set('paymentOption',element.get('paymentOption')._id);
							    element.set('id',element.get('_id'));
								self.addRow(element);							
							 });
					},
					error: function(collection, error, options){
						console.log(error);
					}

				});
			
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