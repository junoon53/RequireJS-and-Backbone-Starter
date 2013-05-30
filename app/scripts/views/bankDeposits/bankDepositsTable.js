define([
	'backbone',
	'jquery', 
	'underscore',
	'models/bankDeposit/bankDepositRow',
	'views/bankDeposits/bankDepositsRowView',
	'vent',
	'text!templates/bankDepositsTable.html'
	], function(Backbone,$,_,BankDepositsRow,BankDepositsRowView,vent,template){

	var BankDepositsTableView = Backbone.View.extend({
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(vent,'CDF.Views.BankDeposits.BankDepositsRowView:exitColumn:amount', this.updateTotal);
			this.listenTo(vent,'CDF.Views.BankDeposits.BankDepositsRowView:delete', this.updateTotal);
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
	    	var row = new BankDepositsRow({personName: "", person:"null", amount:0,
	    												 rowId:0,clinic:0,date:new Date()});
	    	this.model.add(row);
	    	this.addRow(row);
	    		
		},
		addRow: function(rowModel){		

	    	var rowView = new BankDepositsRowView({model: rowModel});
	    	rowView.render();    			

	    	this.rowViews.push(rowView);
			this.$('#rows-container').append((rowView.$el));
			this.updateTotal();		
		},
		fetch: function(date,clinic) {
			var self = this;
			this.model.fetch({ 
				    data: $.param({date:date,clinic:clinic}),
					success: function(collection,response,options){
								_.each(collection.models, function(element,index,array){
								// do some housekeeping... 
							    element.set('personName',element.get('person').firstName + " " + element.get('person').lastName);
							    element.set('person',element.get('person')._id);
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

	return BankDepositsTableView;

});