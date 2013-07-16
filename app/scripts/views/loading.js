define(['backbone','jquery', 'underscore','vent','text!templates/loading.html','image!../resources/images/301.gif'],
	 function(Backbone,$,_,vent,template,bg){

    var _instance = null;

    var Loading = Backbone.View.extend({
    	events: {
      	},
    	initialize: function(){
    		var self = this;
            this.template = _.template(template);
            this.$el.html(this.template({}));
            this.$('loading-gif').html(bg);           
        },
        onClose: function(){
            
        },
        render: function(){
            return this;
        },
    });

    function getInstance() {
        if(_instance === null){
          _instance = new Loading();
          _instance.render();  
        } 
        return _instance;
    }


     return getInstance();

});