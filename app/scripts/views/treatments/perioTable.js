define([
	'backbone',
	'jquery', 
	'underscore',
	'models/treatments/perioRow',
	'collections/treatments/perioRowList',
	'views/treatments/perioRowView',
	'vent',
	'text!templates/perioTable.html'
	], function(Backbone,$,_,PerioRow,PerioRowList,PerioRowView,vent,template){

	var PerioTableView = Backbone.View.extend({
		model: new PerioRowList(),
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(vent,'CDF.Views.Perio.PerioRowView:exitColumn:amount', this.updateTotal);
			this.listenTo(vent,'CDF.Views.Perio.PerioRowView:onValid', this.updateTotal);

			this.listenTo(vent,'CDF.Views.Perio.PerioRowView:delete', this.updateTotal);
			this.listenTo(this.model,'reset' , this.removeAllRowViews);	
			this.listenTo(this.model,'add', this.addRow);
		},
		onClose: function(){

			this.removeAllRowViews();
		},
		handleNewRowSubmit: function(ev){
			ev.preventDefault();
			this.model.add(new PerioRow());
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

	    	var rowView = new PerioRowView({model: rowModel});
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

	return PerioTableView;

});