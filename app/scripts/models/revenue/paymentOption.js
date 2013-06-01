define(['backbone'], function(Backbone) {

	var PaymentOption = Backbone.Model.extend({
		defaults: {
			_id:null,
			name:""
		},
	});

	return PaymentOption;
});