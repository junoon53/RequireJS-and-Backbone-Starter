define(['backbone','config'], function(Backbone,config) {
	var _instance = null;

	var Roles = Backbone.Model.extend({
		url:config.serverUrl+'roles',

		initialize: function(){
			/*this.fetch({success:function(model,response,options){
				_instance = this;
			}});*/
			//this.set('clientKey',client().get('clientKey'));
		},
	});

	

	 return function() {
	 	
		if(_instance == null) {
			_instance = new Roles();
		} 
			
		return _instance;

	}
});