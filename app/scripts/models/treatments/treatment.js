define(['backbone','config'], function(Backbone,config) {

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