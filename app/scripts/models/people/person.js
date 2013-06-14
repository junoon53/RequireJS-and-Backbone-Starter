define(['backbone'], function(Backbone) {

	var Person = Backbone.Model.extend({
		url:'http://54.245.100.246:8080/persons',
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