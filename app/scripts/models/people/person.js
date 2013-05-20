define(['backbone'], function(Backbone) {

	var Person = Backbone.Model.extend({
		url:'http://192.168.211.132:8080/persons',
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