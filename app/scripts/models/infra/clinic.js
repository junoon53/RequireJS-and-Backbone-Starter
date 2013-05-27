define(['backbone'], function(Backbone) {

	var Clinic = Backbone.Model.extend({
		defaults: {
			_id:null,
			name:"",
			shortName:""
		}
	});

	return Clinic;

});