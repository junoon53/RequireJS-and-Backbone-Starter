define(['backbone','config','models/client'], function(Backbone,config,client) {

	var Treatment = Backbone.Model.extend({
		url:config.serverUrl+'treatments',
		defaults: {
			name:"",
			category:"",
			_id:null,
		}
	});

	return Treatment;
});