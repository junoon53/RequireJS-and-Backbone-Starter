define(['backbone'], function(Backbone) {

	var Treatment = Backbone.Model.extend({
		url:'http://54.245.100.246:8080/treatments',
		defaults: {
			name:"",
			category:"",
			_id:null,
		}
	});

	return Treatment;
});