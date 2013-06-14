define(['backbone','models/revenue/paymentOption'], function(Backbone,PaymentOption) {

	var _instance = null;

	var PaymentOptions = Backbone.Collection.extend({
		model: PaymentOption,
		url: 'http://54.245.100.246:8080/paymentOptions' 
	});

	return function() {
		if(_instance === null) {
			_instance = new PaymentOptions();
		}

		return _instance;
	}
});
