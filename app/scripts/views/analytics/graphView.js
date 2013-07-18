define([

    'backbone',
    'jquery', 
    'underscore',
    'utility',

    'datetimepicker'

    ], function(Backbone,$,_,utility){

    var _instance = null;

    var GraphView  = Backbone.View.extend({
        onClose: function(){
        	this.fromDatetimePicker.destroy();
        	this.toDateTimePicker.destroy();
        	//this.$('.graph-container').unbindAll();
        },
        render: function() {

        	var self = this;
            this.$el.html(this.template(this.model.toJSON()));   

            this.$('#fromDatetimepicker').datetimepicker({
              pickTime: false
            });
            this.fromDateTimePicker = this.$('#fromDatetimepicker').data('datetimepicker');
            this.fromDateTimePicker.setLocalDate(this.model.get('fromDate'));

            this.$('#toDatetimepicker').datetimepicker({
              pickTime: false
            });
            this.toDateTimePicker = this.$('#toDatetimepicker').data('datetimepicker');
            this.toDateTimePicker.setLocalDate(new Date(this.model.get("toDate")));

            this.$('input.hideCompletedIssues').attr('checked', true);    
 	

        },
    });

    return GraphView;

});