define([
	'backbone',
	'jquery', 
	'underscore',
	'models/formModels/treatments/implantsRow',
	'collections/formCollections/treatments/implantsRowList',
	'views/formViews/treatments/implantsRowView',
	'vent',
	'text!templates/implantsTable.html'
	], function(Backbone,$,_,ImplantsRow,ImplantsRowList,ImplantsRowView,vent,template){

	var ImplantsTableView = Backbone.View.extend({
		model: new ImplantsRowList(),
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
			this.model.add(new ImplantsRow());
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

	    	var rowView = new ImplantsRowView({model: rowModel});
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

	return ImplantsTableView;

});