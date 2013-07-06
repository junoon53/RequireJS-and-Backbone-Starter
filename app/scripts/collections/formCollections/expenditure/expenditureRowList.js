define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'utility',
	 'models/formModels/expenditure/expenditureRow',
	 'vent'
	 ], function(Backbone,$,_,utility,ExpenditureRow,vent){

	var ExpenditureRowList = Backbone.Collection.extend({
		model: ExpenditureRow,
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);

	    },
	    onClose: function(){

	    },    
		total: function() {
			this._total = 0;
			var self = this;
			_.each(this.filterInvalidRows(),function(row, i,data) {
				 self._total+= parseInt(row.get("amount"),10);
			});
			return this._total;
		},
		filterInvalidRows: function(models){
			return _.reject(this.models,function(element){return !element.isValid()});
		},
		addDataFromReport: function(dataArray){
			var self = this;
			_.each(dataArray,function(element,index,array){
                self.add((new ExpenditureRow({
                	item: element.item,
                    receivedByName: utility.toTitleCase(element.receivedBy.firstName + " " + element.receivedBy.lastName),
                    receivedBy: element.receivedBy._id,
                    sanctionedByName: utility.toTitleCase(element.sanctionedBy.firstName + " " + element.sanctionedBy.lastName),
                    sanctionedBy: element.sanctionedBy._id,
                    amount: element.amount,
                    qty: element.qty
                })));
            });
		},
		getDataForReport: function(){
			var result = [];
		    _.each(this.models,function(element,index,array){                    
               var dataMember = {
               		item: element.get('item'),
                    receivedBy: element.get('receivedBy'),
                    sanctionedBy: element.get('sanctionedBy'),
                    amount: element.get('amount'),
                    paymentOption: element.get('paymentOption'),
                    qty: element.get('qty')
                };
                result.push(dataMember);
            });
		 	return result;
		},
		isValid: function() {
			var result = true;
			_.each(this.models,function(element){

				if(!element.isValid(true)){
				    result = false;
				}
			});
			return result;
		}
		
	});

	return ExpenditureRowList;

});