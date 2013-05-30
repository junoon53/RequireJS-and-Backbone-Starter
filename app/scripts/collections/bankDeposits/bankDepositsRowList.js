define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'models/revenue/revenueRow',
	 'models/app',
	 'vent'], function(Backbone,$,_,BankDepositRow,application,vent) {


	var BankDepositsRowList = Backbone.Collection.extend({
		model: BankDepositRow,
		url: 'http://192.168.211.132:8080/bankDeposits',
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Models.Application:postReportStatus:success', this.reset);
			this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);
			this.listenTo(vent,'CDF.Models.Application:submitReport', this.submitReport);
		},	
		onClose: function() {

		},
		total: function() {
			this._total = 0;
			var self = this;
			_.each(this.filterInvalidRows(),function(row, i,data) {
				 self._total+= parseInt(row.get("amount"),10);
			});
			return this._total;
		},
		fetchBankDepositsByDate: function(date){
			this.reset();
			this.fetch({date:date});
		},
		filterInvalidRows: function(models){
			return _.reject(this.models,function(element){return !element.isValid()});
		},
		submitReport: function(){			
            	vent.trigger('CDF.Collections.BankDepositsRowList:submitReport:start','bankDeposits');

				// destroy the deleted rows
				_.each(this.models,function(element,index,data) {
					if(element.get('markedForDeletion')) element.destroy({success:function(element,index,data){
						console.log('row destroyed successfully: '+element._id);
					}});
				});

				// save the valid, active rows 
				_.each(this.filterInvalidRows(),function(element,index,data){

					element.set('date',application.get('date'),{silent:true});   
                	element.set('clinic',application.get('clinic'),{silent:true});
	                element.save(element.attributes,{

	                    success: function(model, response, options){
	                        console.log(response);

	                        if(index === data.length - 1) {
	                        	vent.trigger('CDF.Collections.BankDepositsRowList:submitReport:success','bankDeposits');
	                        }
	                    },
	                    error: function(model, error, options){
	                        console.log(error);
	                        	vent.trigger('CDF.Collections.BankDepositsRowList:submitReport:failed','bankDeposits');
	                      }
					});
             
	        	});
	        
	    }
	});

	return BankDepositsRowList

});
