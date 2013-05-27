define(['backbone','jquery', 'underscore','models/auth','vent','text!templates/login.html'], function(Backbone,$,_,auth,vent,template){

    var _instance = null;

    var AuthView = Backbone.View.extend({
    	model: auth,
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

    function getInstance() {
        if(_instance === null) _instance = new AuthView();
        return _instance;
    }


    return getInstance();

});