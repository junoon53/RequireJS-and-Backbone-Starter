define([
	'backbone',
	'jquery', 
	'underscore',
	'models/expenditure/expenditureRow',
	'collections/expenditure/expenditureRowList',
	'views/expenditure/expenditureRowView',
	'vent',
	'text!templates/expenditureTable.html'
	], function(Backbone,$,_,ExpenditureRow,ExpenditureRowList,ExpenditureRowView,vent,template){

	var ExpenditureTableView = Backbone.View.extend({
		model: new ExpenditureRowList(),
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(vent,'CDF.Views.Expenditure.ExpenditureRowView:exitColumn:amount', this.updateTotal);
			this.listenTo(vent,'CDF.Views.Expenditure.ExpenditureRowView:delete', this.updateTotal);
			this.listenTo(vent,'CDF.Views.Expenditure.ExpenditureRowView:onValid', this.updateTotal);
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
			this.model.add(new ExpenditureRow());
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

	    	var rowView = new ExpenditureRowView({model: rowModel});
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

	return ExpenditureTableView;

});