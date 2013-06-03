define([
	'backbone',
	'jquery', 
	'underscore',
	'models/patientsFeedback/patientsFeedbackRow',
	'collections/patientsFeedback/patientsFeedbackRowList',
	'views/patientsFeedback/patientsFeedbackRowView',
	'vent',
	'text!templates/patientsFeedbackTable.html'
	], function(Backbone,$,_,PatientsFeedbackRow,PatientsFeedbackRowList,PatientsFeedbackRowView,vent,template){

	var PatientsFeedbackTableView = Backbone.View.extend({
		model: new PatientsFeedbackRowList(),
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
			this.model.add(new PatientsFeedbackRow());
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

	    	var rowView = new PatientsFeedbackRowView({model: rowModel});
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

	return PatientsFeedbackTableView;

});