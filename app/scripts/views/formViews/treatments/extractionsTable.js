define([
	'backbone',
	'jquery', 
	'underscore',
	'models/formModels/treatments/extractionsRow',
	'collections/formCollections/treatments/extractionsRowList',
	'views/formViews/treatments/extractionsRowView',
	'vent',
	'text!templates/extractionsTable.html'
	], function(Backbone,$,_,ExtractionsRow,ExtractionsRowList,ExtractionsRowView,vent,template){

	var ExtractionsTableView = Backbone.View.extend({
		model: new ExtractionsRowList(),
	    events: {
			'click .new-row' : 'handleNewRowSubmit'		
	    },
		initialize: function() {
			this.template = _.template(template);
			
			this.rowViews = [];

			this.listenTo(this.model,'reset' , this.removeAllRowViews);	
			this.listenTo(this.model,'add', this.addRow);
		},
		onClose: function(){

			this.removeAllRowViews();
		},
		handleNewRowSubmit: function(ev){
			ev.preventDefault();
			this.model.add(new ExtractionsRow());
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

	    	var rowView = new ExtractionsRowView({model: rowModel});
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

	return ExtractionsTableView;

});