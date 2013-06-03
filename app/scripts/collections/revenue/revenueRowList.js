define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'models/revenue/revenueRow',
	 'vent'
	 ], function(Backbone,$,_,RevenueRow,vent){

	var RevenueRowList = Backbone.Collection.extend({
		model: RevenueRow,
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Models.Application:postReportStatus:success', this.reset);
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
		totalCash: function(){
			this._total = 0;
			var self = this;
			_.each(this.filterInvalidRows(),function(row, i) {
				if(row.get("paymentOption")==="CASH")
				 self._total+= parseInt(row.get("amount"),10);
			});
			return this._total;
		},
		totalCard: function(){
			this._total = 0;
			var self = this;
			_.each(this.filterInvalidRows(),function(row, i) {
				if(row.get("paymentOption")==="CARD")
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
                self.add((new RevenueRow({
                    patientName: element.patient.firstName + " " + element.patient.lastName,
                    patient: element.patient._id,
                    doctorName: element.doctor.firstName + " " + element.doctor.lastName,
                    doctor: element.doctor._id,
                    amount: element.amount,
                    paymentOption: element.paymentOption._id,
                    paymentOptionName: element.paymentOption.name
                })));
            });
		},
		getDataForReport: function(){
			var result = [];
		    _.each(this.models,function(element,index,array){                    
               var dataMember = {
                    patient: element.get('patient'),
                    doctor: element.get('doctor'),
                    amount: element.get('amount'),
                    paymentOption: element.get('paymentOption')
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

	return RevenueRowList;

});