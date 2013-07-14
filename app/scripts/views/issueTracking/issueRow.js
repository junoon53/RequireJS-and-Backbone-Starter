define([
	'backbone',
	'jquery',
	'underscore',
	'utility',
	'models/issueTracking/issue',
	'vent',
	'text!templates/issueTrackingRow.html',
	'bootstrap',
	
	], function(Backbone,$,_,utility,Issue,vent,template){

	var IssueRowView = Backbone.View.extend({
		//model: new IssueRow(),
		tagName:'tr',
		className: 'issueRow',
		events: {
			'click button.low' : 'setPriority',
			'click button.medium' : 'setPriority',
			'click button.high' :  'setPriority',
			'click button.start' : 'setStatus',
			'click button.inProcess' :  'setStatus',
			'click button.pending' : 'setStatus',
			'click button.complete' : 'setStatus',
            'changeDate #dueDatePicker' : 'setDueDate'

		},
		initialize: function() {
			this.template = _.template(template);

			//this.listenTo(this.model,'change:status',this.setStatus);
			//this.listenTo(this.model,'change:priority',this.setPriority);
		},

		_setStatus: function(status){

			this.resetStatusButtons();
			this.$('button.'+status).addClass('active');

			switch(status) {
				case "start":
					this.$('button.start').addClass('btn-inverse');
					break;
				case "inProcess":
					this.$('button.inProcess').addClass('btn-info');
					break;
				case "pending":
					this.$('button.pending').addClass('btn-warning');
					break;
				case "complete":
					this.$('button.complete').addClass('btn-success');
					break;
				default:
					break;
			}
		},
		_setPriority: function(priority){

			this.resetPriorityButtons();
			this.$('button.'+priority).addClass('active');

			switch(priority){
				case "low":
					this.$('button.low').addClass('btn-info');
					this.$el.addClass('info');
					break;
				case "medium":
					this.$('button.medium').addClass('btn-warning');
					this.$el.addClass('warning');
					break;
				case "high":
					this.$('button.high').addClass('btn-danger');
					this.$el.addClass('error');
					break;
				default:
					break;
			}
		},
		resetStatusButtons: function(){
			this.$('.status').children('button').each(function(i,button){
				$(button).removeClass('active');
			});
			this.$('.start').removeClass('btn-inverse');
			this.$('.inProcess').removeClass('btn-info');
			this.$('.pending').removeClass('btn-warning');
			this.$('.complete').removeClass('btn-success');
		},
		resetPriorityButtons: function(){
			this.$('.priority').children('button').each(function(i,button){
				$(button).removeClass('active');
				
			});
			this.$el.removeClass('info');
			this.$el.removeClass('error');
			this.$el.removeClass('warning');
			this.$('.low').removeClass('btn-info');
			this.$('.medium').removeClass('btn-warning');
			this.$('.high').removeClass('btn-danger');

		},
		setStatus: function(ev){
			//ev.preventDefault();
			var targetClass = ev.currentTarget.className.split(" ")[0];
			if(targetClass === "complete") {
				vent.trigger('Views.IssueTracking.IssueRowView:setStatus:complete',this);
			}
			this._setStatus(targetClass);
			this.model.set('status',targetClass);
			this.model.save();

		},
		setPriority: function(ev){
			//ev.preventDefault();
			var targetClass = ev.currentTarget.className.split(" ")[0];
			this._setPriority(targetClass);
			this.model.set('priority',targetClass);
			this.model.save();
		},
		setDueDate: function(ev) {
			ev.preventDefault();
            this.model.set("dueDate",ev.localDate);
            this.dueDatePicker.hide();
			this.model.save();
		},
		onClose: function(){
			this.dueDatePicker.destroy();
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.IssueTracking.IssueRowView:delete');			
			this.close();
		},
		render: function() {
			this.model.set("rowId",this.model.cid,{silent:true});
			this.$el.html(this.template(this.model.toJSON()));

			this.$('#dueDatePicker').datetimepicker({
              pickTime: false
            });
            this.dueDatePicker = this.$('#dueDatePicker').data('datetimepicker');
            this.dueDatePicker.setLocalDate(this.model.get("dueDate"));

			this._setStatus(this.model.get('status'));
			this._setPriority(this.model.get('priority'));

			return this;
		}
	
	});

	return IssueRowView;

});