define(['backbone','models/revenue/paymentOption','config'], function(Backbone,PaymentOption,config) {

	var _instance = null;

	var PaymentOptions = Backbone.Collection.extend({
		model: PaymentOption,
		url: config.serverUrl+'paymentOptions' 
	});

	return function() {
		if(_instance === null) {
			_instance = new PaymentOptions();
		}

		return _instance;
	}
});
