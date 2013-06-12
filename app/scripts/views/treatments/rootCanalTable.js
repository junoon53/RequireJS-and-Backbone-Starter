define([
	'backbone',
	'jquery', 
	'underscore',
	'models/treatments/rootCanalRow',
	'collections/treatments/rootCanalRowList',
	'views/treatments/rootCanalRowView',
	'vent',
	'text!templates/rootCanalTable.html'
	], function(Backbone,$,_,RootCanalRow,RootCanalRowList,RootCanalRowView,vent,template){

	var RootCanalTableView = Backbone.View.extend({
		model: new RootCanalRowList(),
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(vent,'CDF.Views.RootCanal.RootCanalRowView:exitColumn:amount', this.updateTotal);
			this.listenTo(vent,'CDF.Views.RootCanal.RootCanalRowView:onValid', this.updateTotal);

			this.listenTo(vent,'CDF.Views.RootCanal.RootCanalRowView:delete', this.updateTotal);
			this.listenTo(this.model,'reset' , this.removeAllRowViews);	
			this.listenTo(this.model,'add', this.addRow);
		},
		onClose: function(){

			this.removeAllRowViews();
		},
		handleNewRowSubmit: function(ev){
			ev.preventDefault();
			this.model.add(new RootCanalRow());
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

	    	var rowView = new RootCanalRowView({model: rowModel});
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

	return RootCanalTableView;

});