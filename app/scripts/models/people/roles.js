define(['backbone'], function(Backbone) {
	var _instance = null;

	var Roles = Backbone.Model.extend({
		url:'http://54.245.100.246:8080/roles',

		initialize: function(){
			/*this.fetch({success:function(model,response,options){
				_instance = this;
			}});*/
			//this.set('clientKey',client().get('clientKey'));
		}
	});

	

	 return function() {
	 	
		if(_instance == null) {
			_instance = new Roles();
		} 
			
		return _instance;

	}
});