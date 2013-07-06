define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'utility',
	 'models/formModels/bankDeposit/bankDepositRow',
	 'vent'], function(Backbone,$,_,utility,BankDepositRow,vent) {


	var BankDepositsRowList = Backbone.Collection.extend({
		model: BankDepositRow,
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);
		},	
		onClose: function() {

		},
		addDataFromReport: function(dataArray){
			var self = this;
            _.each(dataArray,function(element,index,array){
                self.add((new BankDepositRow({
                    personName: utility.toTitleCase(element.person.firstName + " " + element.person.lastName),
                    person: element.person._id,
                    amount: element.amount
                })));
            });
		},
		getDataForReport: function(){
			var result = [];
			_.each(this.models,function(element,index,array){
                    var dataMember = {
                        person: element.get('person'),
                        amount: element.get('amount')
                    };
                    result.push(dataMember);
                });
			return result;
		},
		total: function() {
			this._total = 0;
			var self = this;
			_.each(this.filterInvalidRows(),function(row, i,data) {
				 self._total+= parseInt(row.get("amount"),10);
			});
			return this._total;
		},
		filterInvalidRows: function(){
			return _.reject(this.models,function(element){return !element.isValid(true)});
		},
		isValid: function() {
			var result = true;
			_.each(this.models,function(element){

				if(!element.isValid(true)){
				    result = false;
				}
			});
			return result;
		},
		
	});

	return BankDepositsRowList

});
