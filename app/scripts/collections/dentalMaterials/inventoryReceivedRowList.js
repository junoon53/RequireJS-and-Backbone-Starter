define([
	 'backbone',
	 'jquery',
     'underscore',
     'utility',
	 'models/dentalMaterials/inventoryReceivedRow',
	 'vent'
	 ], function(Backbone,$,_,utility,InventoryReceivedRow,vent){

	var InventoryReceivedRowList = Backbone.Collection.extend({
		model: InventoryReceivedRow,
		initialize: function(){
			var self = this;

			this.listenTo(vent,'CDF.Models.Application:postReportStatus:success', this.reset);
			this.listenTo(vent,'CDF.Views.AppView:handleLogoutClick', this.reset);

	    },
	    onClose: function(){

	    },    
		filterInvalidRows: function(models){
			return _.reject(this.models,function(element){return !element.isValid()});
		},
		addDataFromReport: function(dataArray){
			var self = this;
			_.each(dataArray,function(element,index,array){
                self.add((new InventoryReceivedRow({
                	_id: element._id,
                	expendableInventoryItem: element.expendableInventoryItem._id,
                    genericName: utility.toTitleCase(element.expendableInventoryItem.genericName),
                    brandName: utility.toTitleCase(element.expendableInventoryItem.brandName),
                    accountingUnit: element.expendableInventoryItem.accountingUnit,
                    expendableInventoryType: utility.toTitleCase(element.expendableInventoryItem.expendableInventoryType.name),
                    qtyReceived: element.qtyReceived,
                    dateExpiry: new Date(element.dateExpiry),
                    receivedBy: element.receivedBy._id,
                    receivedByName: utility.toTitleCase(element.receivedBy.firstName+" "+element.receivedBy.lastName)
                })));
            });
		},
		getDataForReport: function(){
			var result = [];
		    _.each(this.models,function(element,index,array){                    
               var dataMember = {
               		_id: element.get('_id'),
               		expendableInventoryItem: element.get('expendableInventoryItem'),
                    qtyReceived:element.get('qtyReceived'),
                    dateExpiry: element.get('dateExpiry'),
                    receivedBy: element.get('receivedBy')
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

	return InventoryReceivedRowList;

});