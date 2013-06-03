define([
	'backbone',
	'jquery', 
	'underscore',
	'models/bankDeposit/bankDepositRow',
	'collections/bankDeposits/bankDepositsRowList',
	'views/bankDeposits/bankDepositsRowView',
	'vent',
	'text!templates/bankDepositsTable.html'
	], function(Backbone,$,_,BankDepositsRow,BankDepositsRowList,BankDepositsRowView,vent,template){

	var BankDepositsTableView = Backbone.View.extend({
		model: new BankDepositsRowList(),
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(vent,'CDF.Views.BankDeposits.BankDepositsRowView:exitColumn:amount', this.updateTotal);
			this.listenTo(vent,'CDF.Views.Revenue.RevenueRowView:onValid', this.updateTotal);
			this.listenTo(vent,'CDF.Views.BankDeposits.BankDepositsRowView:delete', this.updateTotal);
			this.listenTo(this.model,'reset' , this.removeAllRowViews);	
			this.listenTo(this.model,'add', this.addRow);					
		},
		onClose: function(){

			this.removeAllRowViews();
		},
		handleNewRowSubmit: function(ev){
			ev.preventDefault();
			this.model.add(new BankDepositsRow());
		},	
		addRow: function(rowModel){		

	    	var rowView = new BankDepositsRowView({model: rowModel});
	    	rowView.render();    		

	    	this.rowViews.push(rowView);
			this.$('#rows-container').append((rowView.$el));
			this.updateTotal();		
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
		removeAllRowViews: function() {
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