define([
    'backbone',
    'jquery', 
    'underscore',
    'vent',
    'text!templates/submit.html'
    ], function(Backbone,$,_,vent,template){

    var submit = Backbone.View.extend({
        events: {
            'click .submit' : 'submit'
        },
        initialize: function(){
           this.template =  _.template(template);
           this.$el.html(this.template({})); 
        },
        onClose: function(){

        },
        submit: function(ev){
            ev.preventDefault();
            vent.trigger("CDF.Views.AppView:click:submit");
        },
    });
   
    return submit;

});