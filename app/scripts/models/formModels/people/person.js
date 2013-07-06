define(['backbone','config'], function(Backbone,config) {

	var Person = Backbone.Model.extend({
		url:config.serverUrl+'persons',
		defaults: {
			firstName:"",
			lastName:"",
			isActive:null,
			roles:[],
			clinics:[]
		}
	});

	return Person;
});