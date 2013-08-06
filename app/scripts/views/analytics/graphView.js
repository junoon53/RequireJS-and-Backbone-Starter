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
        	//this.$('.graph-container').unbindAll();
        },
        render: function() {

        	var self = this;
            this.$el.html(this.template(this.model.toJSON()));   
        },
    });

    return GraphView;

});