define([
	'backbone',
	'jquery', 
	'underscore',
	'models/formModels/treatments/denturesRow',
	'collections/formCollections/treatments/denturesRowList',
	'views/formViews/treatments/denturesRowView',
	'vent',
	'text!templates/denturesTable.html'
	], function(Backbone,$,_,DenturesRow,DenturesRowList,DenturesRowView,vent,template){

	var DenturesTableView = Backbone.View.extend({
		model: new DenturesRowList(),
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(vent,'CDF.Views.Dentures.DenturesRowView:delete', this.updateTotal);
			this.listenTo(this.model,'reset' , this.removeAllRowViews);	
			this.listenTo(this.model,'add', this.addRow);
		},
		onClose: function(){

			this.removeAllRowViews();
		},
		handleNewRowSubmit: function(ev){
			ev.preventDefault();
			this.model.add(new DenturesRow());
		},
		isValid: function() {
			var result = this.model.isValid();
			if(!result){
				this.$('.error-message').show(); 
			} else {
				this.$('.error-message').hide();
			}
			return result;
		},	
		addRow: function(rowModel){		

	    	var rowView = new DenturesRowView({model: rowModel});
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

	return DenturesTableView;

});