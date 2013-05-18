define(['backbone','models/revenue/paymentOption'], function(Backbone,PaymentOption) {

	var paymentOptions = Backbone.Collection.extend({
		model: PaymentOption,
		url: 'http://192.168.211.132:8080/paymentOptions' 
	});

	return paymentOptions;
});
