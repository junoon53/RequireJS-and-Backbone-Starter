define(['backbone','config','models/client'], function(Backbone,config,client) {

	var Person = Backbone.Model.extend({
		url:config.serverUrl+'persons',
		defaults: {
			salutation:"",
			firstName:"",
			lastName:"",
			age: 0,
			sex: "M",
			isActive:null,
			roles:[],
			clinics:[],
			serverKey: client().get('serverKey')
		}
	});

	return Person;
});