define([
	'backbone',
	'jquery', 
	'underscore',
	'models/clinicIssues/clinicIssuesRow',
	'collections/clinicIssues/clinicIssuesRowList',
	'views/clinicIssues/clinicIssuesRowView',
	'vent',
	'text!templates/clinicIssuesTable.html'
	], function(Backbone,$,_,ClinicIssuesRow,ClinicIssuesRowList,ClinicIssuesRowView,vent,template){

	var ClinicIssuesTableView = Backbone.View.extend({
		model: new ClinicIssuesRowList(),
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
			this.model.add(new ClinicIssuesRow());
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

	    	var rowView = new ClinicIssuesRowView({model: rowModel});
	    	rowView.render();    			

	    	this.rowViews.push(rowView);
			this.$('#rows-container').append((rowView.$el));
		},
		removeAllRowViews: function() {
			//this.$('#rows-container').html('');
			for(var i=0;i<this.rowViews.length;i++){
				this.rowViews[i].close();
			}
		},
		render: function() {

			var self = this;
			this.$el.html(this.template(this.model.toJSON()));	
			return this;
		},
	});

	return ClinicIssuesTableView;

});