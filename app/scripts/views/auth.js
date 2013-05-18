define(['backbone','jquery', 'underscore','models/auth','vent','text!templates/login.html'], function(Backbone,$,_,Auth,vent,template){

    var AuthView = Backbone.View.extend({
    	model: new Auth(),
    	events: {
            "click #login": "handleLoginClick"
      	},
    	initialize: function(){
    		var self = this;
            this.template = _.template(template);
            this.$el.html(this.template({}));           
        },
        onClose: function(){
            
        },
        render: function(){
            return this;
        },
        handleLoginClick: function(ev){
            ev.preventDefault();
            this.model.login();
        }
    });

    return AuthView;

});