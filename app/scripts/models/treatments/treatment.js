define(['backbone'], function(Backbone) {

	var Treatment = Backbone.Model.extend({
		url:'http://192.168.211.132:8080/treatments',
		defaults: {
			name:"",
			category:"",
			_id:null,
		}
	});

	return Treatment;
});