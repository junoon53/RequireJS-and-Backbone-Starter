define([
	 'backbone',
	 'jquery',
	 'underscore',
	 'models/revenue/revenueRow',
	 'vent'
	 ], function(Backbone,$,_,RevenueRow,vent){

	var RevenueRowList = Backbone.Collection.extend({
		url: 'http://192.168.211.132:8080/revenue',
		model: RevenueRow,
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Models.Application:postReportStatus', this.reset);
			this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);
			this.listenTo(vent,'CDF.Models.Application:submitReport', this.submitReport);
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
		rowCount: function(){
			return this.filterInvalidRows().length;
		},
		fetchRevenueByDate: function(date){
			this.reset();
			this.fetch({date:date});
		},
		filterInvalidRows: function(models){
			return _.reject(this.models,function(element){return !element.isValid()});
		},
		submitReport: function(msg){			
				// destroy the deleted rows
				_.each(this.models,function(element,index,data){
					if(element.get('markedForDeletion')){
						element.destroy({success: function(model, response){
							console.log('destroyed model: '+model.get('_id'));
						}});
					} 
				});

				// save the valid, active rows 
				_.each(this.filterInvalidRows(),function(element,index,data){

					element.set('date',msg.date,{silent:true});   
                	element.set('clinic',msg.clinic,{silent:true});
	                element.save(element.attributes,{

	                    success: function(model, response, options){
	                        console.log(response);

	                        if(index === data.length - 1) {
	                        	vent.trigger('CDF.Collections.RevenueRowList:submitReport','revenue');
	                        }
	                    },
	                    error: function(model, error, options){
	                        console.log(error);
	                        success = false;
	                    }
					});
             
	        	});
	        
	    }
	});

	return RevenueRowList;

});