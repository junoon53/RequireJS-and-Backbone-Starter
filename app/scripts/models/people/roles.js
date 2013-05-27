define(['backbone'], function(Backbone) {
	var _instance = null;

	var Roles = Backbone.Model.extend({
		url:'http://192.168.211.132:8080/roles',
		initialize: function(){
			/*this.fetch({success:function(model,response,options){
				_instance = this;
			}});*/
		}
	});

	

	 return function() {
	 	
		if(_instance == null) {
			_instance = new Roles();
		} 
			
		return _instance;

	}
});